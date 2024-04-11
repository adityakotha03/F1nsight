import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchDriversAndTires, fetchCircuitIdByCountry, fetchRaceResultsByCircuit } from '../utils/api';
import { DriverCard } from './DriverCard';
import { TireStrategyCard } from './TireStrategyCard';
import { fetchLocationData } from '../utils/api';
import {ThreeCanvas} from './ThreeCanvas.js'
import { LapChart } from './LapChart';
import { TireStrategy } from './TireStrategy';

export function RacePage() {
  const { state } = useLocation();
  const { raceName, meetingKey, year, country } = state || {};
  const [drivers, setDrivers] = useState([]);
  const [laps, setLaps] = useState([]);
  const [driversDetails, setDriversDetails] = useState({});
  const [startingGrid, setStartingGrid] = useState([]);
  const [circuitId, setCircuitId] = useState('');
  const [raceResults, setRaceResults] = useState([]);
  const [locData, setlocData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!meetingKey) return;
    
      try {
        // Fetch circuit ID based on the country and year
        const circuitId = await fetchCircuitIdByCountry(year, country);
        setCircuitId(circuitId);
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

          const driverId = 1; // Example
          const startTime = '2024-03-02T16:00';
          const endTime = '2024-03-02T16:20';
          const scaleFactor = 1500;
          try {
            const locationData = await fetchLocationData(sessionKey, driverId, startTime, endTime, scaleFactor);
            setlocData(locationData);
            // console.log(locationData); // Log the fetched and processed location data
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
    
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

  return (
    <div>
      <h2 className="heading-2">Race Details</h2>
      {raceName && <p>Race Name: {raceName} {year}</p>}
      {meetingKey && <p>Meeting Key: {meetingKey}</p>}

      <div className="race-page flex flex-col sm:flex-row gap-16">
        <div className="sm:grow-0">
          <ul className="mb-64">
            {raceResults.map((result, index) => (
              <DriverCard 
                driver={result.Driver}
                position={result.position}
                year={year} 
                time={result.Time?.time || result.status}
                fastestLap={result.FastestLap}
                layoutSmall={index > 2}
              />
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
          <div className="canvas-wrapper mb-64">
            <ThreeCanvas imageFile="/maps/map.png" locData = {locData}/>
          </div>

          <h3 className="heading-6 mb-16">Lap Data</h3>
          <LapChart laps={laps} setLaps={() => setLaps} driversDetails={driversDetails} raceResults = {raceResults} className="lap-chart" />
        
          <h3 className="heading-6 mb-16">Tire Strategy</h3>
          {/* TireStrategy component needs help see notes inside cmponent and uncomment linen below to see test version */}
           <TireStrategy drivers={drivers} raceResults={raceResults} />

          {/*{drivers.map((driver, index) => (
            <TireStrategyCard key={index} driver={driver.acronym} tires={driver.tires} />
          ))} */}

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
        </div>
     </div>
    </div>
  );
}
