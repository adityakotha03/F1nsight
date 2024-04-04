import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { fetchDriversAndTires, fetchCircuitIdByCountry, fetchRaceResultsByCircuit } from '../utils/api';
import { DriverCard } from './DriverCard';
import { TireStrategyCard } from './TireStrategyCard';
import { fetchLocationData } from '../utils/api';

export function RacePage() {
  const { state } = useLocation();
  const { raceName, meetingKey, year, country } = state || {};
  const [drivers, setDrivers] = useState([]);
  const [laps, setLaps] = useState([]);
  const [driversDetails, setDriversDetails] = useState({});
  const [startingGrid, setStartingGrid] = useState([]);
  const [circuitId, setCircuitId] = useState('');
  const [raceResults, setRaceResults] = useState([]);

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

        if (drivers.length > 0) {
          const driverId = 1; // Example
          const startTime = '2024-03-02T16:00';
          const endTime = '2024-03-02T16:10';
          const scaleFactor = 100;
          try {
            //const locationData = await fetchLocationData(sessionKey, driverId, startTime, endTime, scaleFactor);
            //console.log(locationData); // Log the fetched and processed location data
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
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
  }, [meetingKey, year, country, circuitId]);

  const handleDriverAcronymClick = (acronym) => {
    const driverLaps = laps.filter(lap => lap.driver_acronym === acronym);
    const lapDetails = driverLaps.map(lap => `Lap Number: ${lap.lap_number}, Duration: ${lap.lap_duration}, Driver: ${acronym}`).join(', ');
    console.log(lapDetails);
  };

  const uniqueAcronyms = [...new Set(laps.map(lap => lap.driver_acronym))];

  // console.log(raceResults);

  return (
    <div>
      <h2 className="heading-2">Race Details</h2>
      {raceName && <p>Race Name: {raceName} {year}</p>}
      {meetingKey && <p>Meeting Key: {meetingKey}</p>}

      <h3>Leaderboard</h3>
      <div className="race-page flex">
        <div className="race-page__col grow-0">
          <ul>
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
        </div>
        <div className="race-page__col grow">
          <h3 className="heading-3">Lap Data</h3>
          <p>Click on a driver acronym to see their lap details in console:</p>
          <ul>
            {uniqueAcronyms.map((acronym, index) => (
              <li key={index} style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleDriverAcronymClick(acronym)}>
                {acronym}
              </li>
            ))}
          </ul>
        </div>
      </div>
      

      <h3 className="heading-3">Tire Strategy</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver, index) => (
          <TireStrategyCard key={index} driver={driver.acronym} tires={driver.tires} />
        ))}
      </div>

      <h3 className="heading-3">Starting Grid</h3>
      <ul>
        {startingGrid
          .sort((a, b) => a.position - b.position)
          .map((gridPosition, index) => (
            <li key={index}>
              Position: {gridPosition.position}, Driver: {driversDetails[gridPosition.driver_number]}
            </li>
          ))}
      </ul>

      <h3 className="heading-3">Fastest Laps</h3>
      <ul>
        {raceResults
          .filter(result => result.FastestLap && result.FastestLap.rank) // Filter out results without FastestLap or rank
          .sort((a, b) => parseInt(a.FastestLap.rank) - parseInt(b.FastestLap.rank)) // Use parseInt to ensure numerical comparison
          .map((result, index) => (
            <li key={index}>
              Rank: {result.FastestLap.rank}, Lap: {result.FastestLap.lap}, Time: {result.FastestLap.Time.time}, Driver Name: {result.Driver.code}, Constructor: {result.Constructor.name}
            </li>
          ))}
      </ul>


    </div>
  );
}