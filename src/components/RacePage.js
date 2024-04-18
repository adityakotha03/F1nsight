import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchDriversAndTires, fetchCircuitIdByCountry, fetchRaceResultsByCircuit } from '../utils/api';
import { DriverCard } from './DriverCard';
import { fetchLocationData } from '../utils/api';
import {ThreeCanvas} from './ThreeCanvas.js'
import { LapChart } from './LapChart';
import { TireStrategy } from './TireStrategy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function RacePage() {
  const { state } = useLocation();
  const { raceName, meetingKey, year, country } = state || {};
  const [drivers, setDrivers] = useState([]);
  const [laps, setLaps] = useState([]);
  const [driversDetails, setDriversDetails] = useState({});
  const [startingGrid, setStartingGrid] = useState([]);
  const [circuitId, setCircuitId] = useState('');
  const [ImagePath, setImagePath] = useState('');
  const [raceResults, setRaceResults] = useState([]);
  const [locData, setlocData] = useState({});
  const [driverSelected, setDriverSelected] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [driverCode, setdriverCode] = useState('');
  const [startTime, setstartTime] = useState('');
  const [endTime, setendTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!meetingKey) return;
    
      try {
        setDriverSelected(false);
        setActiveButtonIndex(null);
        // Fetch circuit ID based on the country and year. UK and Abu dabi doesnt match, so this takes care of that.
        const countryMap = {
          "Great Britain": "UK",
          "United Arab Emirates": "UAE"
        };
    
        // Check if the country is in the map and replace it if it is
        const adjustedCountry = countryMap[country] || country;
        const circuitId = await fetchCircuitIdByCountry(year, adjustedCountry);
        setCircuitId(circuitId);
        setImagePath(`/maps/${circuitId}.png`);
        //console.log(circuitId);

        if (circuitId) {
          const results = await fetchRaceResultsByCircuit(year, circuitId);
          setRaceResults(results);
        }

        const sessionsResponse = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`);
        const sessionsData = await sessionsResponse.json();
        const raceSession = sessionsData.find(session => session.session_name === "Race");
        if (!raceSession) throw new Error('Race session not found');
        const sessionKey = raceSession.session_key;
    
        const [driverDetailsData, startingGridData, driversData, lapsData] = await Promise.all([
          fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`).then(res => res.json()),
          fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`).then(res => res.json()),
          fetchDriversAndTires(sessionKey),
          fetch(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`).then(res => res.json())
        ]);
    
        const driverDetailsMap = driverDetailsData.reduce((acc, driver) => ({
          ...acc,
          [driver.driver_number]: driver.name_acronym
        }), {});
    
        setDriversDetails(driverDetailsMap);

        const latestDate = startingGridData[0].date;
        const firstDifferentDate = startingGridData.find(item => item.date !== latestDate)?.date;
        setstartTime(firstDifferentDate); //'2024-03-02T16:00';
        //console.log(startTime);
        setendTime(startingGridData[startingGridData.length - 1].date); //'2024-03-02T16:20';
        //console.log(endTime);

        const earliestDateTime = startingGridData[0]?.date;
        const filteredStartingGrid = startingGridData.filter(item => item.date === earliestDateTime);
        setStartingGrid(filteredStartingGrid);
    
        setDrivers(driversData);
    
        setLaps(lapsData.map(lap => ({
          ...lap,
          driver_acronym: driverDetailsMap[lap.driver_number]
        })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };    

    fetchData();
  }, [meetingKey, year]);

  const handleDriverSelectionClick = (index) => {
    console.log(raceResults[index].Driver.code); // Log the driver code
    console.log(raceResults[index].number);
  
    if (activeButtonIndex === index) {
      setDriverSelected(false);
      setActiveButtonIndex(null); // Reset the active button index
    } else {
      setDriverSelected(true);
      setdriverCode(raceResults[index].number);
      setActiveButtonIndex(index); // Set new active button index
  
      (async () => {
        try {
          // Fetch sessions to find the race session
          const sessionsResponse = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`);
          const sessionsData = await sessionsResponse.json();
          const raceSession = sessionsData.find(session => session.session_name === "Race");
          if (!raceSession) throw new Error('Race session not found');
          const sessionKey = raceSession.session_key;
  
          const scaleFactor = 1500;
  
          // Fetch location data using sessionKey, driverId (from state), startTime, and endTime
          const locationData = await fetchLocationData(sessionKey, raceResults[index].number, startTime, endTime, scaleFactor);
          setlocData(locationData);
          console.log(locationData); // Log the fetched and processed location data
  
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      })();
    }
  };

  return (
      <div className="race-page flex flex-col sm:flex-row gap-16 mt-32">
        <div className="sm:grow-0">
          <ul className="mb-64 flex flex-col">
          {raceResults.map((result, index) => (
            <button 
              key={index}
              className="block w-full mb-8"
              onClick={() => handleDriverSelectionClick(index)}
            >
              <DriverCard 
                hasHover
                isActive={activeButtonIndex === index}
                driver={result.Driver}
                position={result.position}
                year={year}
                time={result.Time?.time || result.status}
                fastestLap={result.FastestLap}
                layoutSmall={index > 2}
              />
            </button>
            ))}
          </ul>

          <h3 className="heading-6 mb-16">Starting Grid</h3>
          <ul className="flex flex-col w-fit m-auto">
            {startingGrid
              .sort((a, b) => a.position - b.position)
              .map((gridPosition, index) => (
                <li 
                  key={index} 
                  className="text-center w-fit even:-mt-32 even:ml-64 even:mb-24"
                >
                  <div className="text-sm font-display text-stone-500">P{gridPosition.position}</div>
                  <div className="border-x-2 border-t-2 border-solid border-stone-500 px-4 pt-4 w-52">
                    {driversDetails[gridPosition.driver_number]}
                  </div> 
                </li>
              ))}
          </ul>
        </div>

        <div className="sm:grow-0">
        {raceName && <p className="heading-2 text-right text-stone-500 mb-24">{raceName} {year}</p>}
        {/* {meetingKey && <p>Meeting Key: {meetingKey}</p>} */}
          <div className="canvas-wrapper mb-64">
            <ThreeCanvas imageFile={ImagePath} locData = {locData} driverSelected={driverSelected}/>
            <div className="bg-glow gradient-border p-16">
              <button><FontAwesomeIcon icon="play" className="mr-32" /></button>
              <button><FontAwesomeIcon icon="pause" /></button>
            </div>
            <div className="bg-glow gradient-border p-16">
              <select name="driver select" id="driver-select">
                <option value="">All</option>
                <option value="dog">Ham</option>
                <option value="cat">Sai</option>
                <option value="hamster">Nor</option>
                <option value="parrot">Rus</option>
                <option value="spider">Ver</option>
                <option value="goldfish">Per</option>
              </select>
            </div>
            <div className="bg-glow gradient-border p-16">
              Playback Speed: 
              <button className="px-16 py-8">normal</button>
              <button className="px-16 py-8">push push</button>
              <button className="px-16 py-8">drs</button>
            </div>
          </div>

          <h3 className="heading-6 mb-16">Lap Data</h3>
          <LapChart laps={laps} setLaps={() => setLaps} driversDetails={driversDetails} raceResults = {raceResults} className="lap-chart" driverCode={driverSelected ? driversDetails[driverCode] : null} />
        
          <h3 className="heading-6 mb-16">Tire Strategy</h3>
          <TireStrategy drivers={drivers} raceResults={raceResults} driverCode={driverSelected ? driversDetails[driverCode] : null} />


          {!driverSelected && (
            <>
              <h3 className="heading-6 mb-16">Fastest Laps</h3>
              <div className="grid grid-cols-3 gap-4 mb-16">
                <span>Driver</span> 
                <span>Time</span> 
                <span>Lap</span> 
              </div>
              <ul className="mb-16">
                {raceResults
                  .filter(result => result.FastestLap && result.FastestLap.rank)
                  .sort((a, b) => parseInt(a.FastestLap.rank) - parseInt(b.FastestLap.rank))
                  .map((result, index) => (
                    <li key={index} className="grid grid-cols-3 gap-4 mb-8">
                      <div>
                        {result.Driver.code}
                        <span className="text-sm ml-8 text-stone-500">{result.Constructor.name}</span>
                      </div>
                      <span>{result.FastestLap.Time.time}</span>
                      <span>{result.FastestLap.lap}</span>
                      
                    </li>
                  ))}
              </ul>
            </>
          )} 
        </div>
     </div>
  );
}
