import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchDriversAndTires, fetchCircuitIdByCountry, fetchRaceResultsByCircuit } from '../utils/api';
import { DriverCard } from './DriverCard';
import { fetchLocationData } from '../utils/api';
import {ThreeCanvas} from './ThreeCanvas.js'
import { LapChart } from './LapChart';
import { TireStrategy } from './TireStrategy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

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
  const [speedFactor, setSpeedFactor] = useState(4); // Manage speed state here
  const [pauseButton, setpauseButton] = useState(true);

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

  const selectInputDriverImage = driversDetails[locData[0]?.cardata.driver_number]

  return (

    <>

      <div className="race-display">
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
                index={index}
                driver={result.Driver}
                position={result.position}
                year={year}
                time={result.Time?.time || result.status}
                fastestLap={result.FastestLap}
                layoutSmall={index > 2}
                mobileSmall
              />
            </button>
          ))}
        </ul>
        <ThreeCanvas 
              imageFile={ImagePath} 
              locData={locData}
              driverSelected={driverSelected}
              pauseButton={pauseButton}
              controls={
                <>
                  <div className="flex">
                    <div className="gradient-border-extreme flex items-center gap-32 py-16 px-32 grow-0">
                      <button><FontAwesomeIcon icon="play" onClick={() => setpauseButton(true)} /></button>
                      <button><FontAwesomeIcon icon="pause" onClick={() => setpauseButton(false)} /></button>
                    </div>
                    <div className="gradient-border-extreme px-16 flex items-end justify-end grow">
                        <div className="mr-8 tracking-wide uppercase pb-16">
                          <span className="text-neutral-500 mr-4">Driver</span>
                          <select name="driver select" id="driver-select" className="uppercase bg-transparent border-none text-base mr-4">
                              <option value="">All</option>
                              <option value="HAM">HAM</option>
                              <option value="SAI">SAI</option>
                              <option value="NOR">NOR</option>
                              <option value="RUS">RUS</option>
                              <option value="VER">VER</option>
                              <option value="PER">PER</option>
                          </select>
                        </div>
                        {selectInputDriverImage && (
                          <img 
                            alt="" 
                            className="-mt-32"
                            src={`/images/${year}/drivers/${selectInputDriverImage}.png`} 
                            width={80} 
                            height={80} 
                          />
                        )}
                    </div>
                  </div>
                  <div className="flex justify-between gap-16 gradient-border-extreme py-16 tracking-wide uppercase px-32">
                    Playback Speed:
                    <button
                      className={classNames("tracking-wide uppercase", { 'text-neutral-500': speedFactor !== 4})}
                      onClick={() => setSpeedFactor(4)}
                    >
                      Normal
                    </button>
                    <button
                      className={classNames("tracking-wide uppercase", { 'text-neutral-500': speedFactor !== 1.5})}
                      onClick={() => setSpeedFactor(1.5)}
                    >
                      Push
                    </button>
                    <button
                      className={classNames("tracking-wide uppercase", { 'text-neutral-500': speedFactor !== 0.2})}
                      onClick={() => setSpeedFactor(0.2)}
                    >
                      DRS
                    </button> 
                  </div>
                </>
              }
              speedFactor={speedFactor}
            />
      </div>

      <div className="race-page flex flex-col sm:flex-row gap-16 mt-32">
        <div className="sm:grow-0">
          {/* <ul className="mb-64 flex flex-col">
          {raceResults.map((result, index) => (
            <button 
              key={index}
              className="block w-full mb-8"
              onClick={() => handleDriverSelectionClick(index)}
            >
              <DriverCard 
                hasHover
                isActive={activeButtonIndex === index}
                index={index}
                driver={result.Driver}
                position={result.position}
                year={year}
                time={result.Time?.time || result.status}
                fastestLap={result.FastestLap}
                layoutSmall={index > 2}
              />
            </button>
            ))}
          </ul> */}

          <h3 className="heading-6 mb-16">Starting Grid</h3>
          <ul className="flex flex-col w-fit m-auto">
            {startingGrid
              .sort((a, b) => a.position - b.position)
              .map((gridPosition, index) => (
                <li 
                  key={index} 
                  className="text-center w-fit even:-mt-32 even:ml-64 even:mb-24"
                >
                  <div className="text-sm font-display text-neutral-500">P{gridPosition.position}</div>
                  <div className="border-x-2 border-t-2 border-solid border-neutral-500 px-4 pt-4 w-52">
                    {driversDetails[gridPosition.driver_number]}
                  </div> 
                </li>
              ))}
          </ul>
        </div>

        <div className="sm:grow-0">
        {raceName && <p className="heading-2 text-right text-neutral-500 mb-24">{raceName} {year}</p>}
          <div className="canvas-wrapper mb-64">
            {/* <ThreeCanvas 
              imageFile={ImagePath} 
              locData={locData}
              driverSelected={driverSelected}
              pauseButton={pauseButton}
              controls={
                <>
                  <div className="bg-glow gradient-border p-16">
                    Playback Speed:
                    <button
                      style={{
                        padding: '16px 32px',
                        color: speedFactor === 4 ? 'white' : 'initial',
                        backgroundColor: speedFactor === 4 ? 'red' : 'initial',
                        boxShadow: speedFactor === 4 ? '0 0 10px red, 0 0 20px red, 0 0 30px red, 0 0 40px red' : 'none'
                      }}
                      onClick={() => setSpeedFactor(4)}
                    >
                      Normal
                    </button>
                    <button
                      style={{
                        padding: '16px 32px',
                        color: speedFactor === 1.5 ? 'white' : 'initial',
                        backgroundColor: speedFactor === 1.5 ? 'red' : 'initial',
                        boxShadow: speedFactor === 1.5 ? '0 0 10px red, 0 0 20px red, 0 0 30px red, 0 0 40px red' : 'none'
                      }}
                      onClick={() => setSpeedFactor(1.5)}
                    >
                      Push
                    </button>
                    <button
                      style={{
                        padding: '16px 32px',
                        color: speedFactor === 0.2 ? 'white' : 'initial',
                        backgroundColor: speedFactor === 0.2 ? 'red' : 'initial',
                        boxShadow: speedFactor === 0.2 ? '0 0 10px red, 0 0 20px red, 0 0 30px red, 0 0 40px red' : 'none'
                      }}
                      onClick={() => setSpeedFactor(0.2)}
                    >
                      DRS
                  </button> 
                  </div>
                  <div className="flex justify-between flex-row-reverse">
                    <div className="bg-glow gradient-border p-16 flex items-center justify-start">
                        <div className="mr-8">
                            <select name="driver select" id="driver-select" className="mr-4">
                                <option value="">All</option>
                                <option value="HAM">HAM</option>
                                <option value="SAI">SAI</option>
                                <option value="NOR">NOR</option>
                                <option value="RUS">RUS</option>
                                <option value="VER">VER</option>
                                <option value="PER">PER</option>
                            </select>
                        </div>
                        {selectInputDriverImage && (
                          <img 
                          alt="" 
                          src={`/images/${year}/drivers/${selectInputDriverImage}.png`} 
                          width={80} 
                          height={80} 
                          />
                        )}
                    </div>
                    <div className="bg-glow gradient-border p-16">
                      <button><FontAwesomeIcon icon="play" className="mr-32" onClick={() => setpauseButton(true)} /></button>
                      <button><FontAwesomeIcon icon="pause" onClick={() => setpauseButton(false)} /></button>
                    </div>
                  </div>
                </>
              }
              speedFactor={speedFactor}
            /> */}
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
                        <span className="text-sm ml-8 text-neutral-500">{result.Constructor.name}</span>
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
    </>
  );
}
