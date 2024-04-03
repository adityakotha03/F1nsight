import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchDriversAndTires, fetchCircuitIdByCountry, fetchRaceResultsByCircuit } from '../utils/api';

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

  return (
    <div>
      <h2>Race Details</h2>
      {raceName && <p>Race Name: {raceName} {year}</p>}
      {meetingKey && <p>Meeting Key: {meetingKey}</p>}

      <h3>Leaderboard</h3>
      <ul>
        {raceResults.map((result, index) => (
          <li key={index}>
            Position: {result.position}, Number: {driversDetails[result.number]}, 
            Time: {result.Time?.time || 'N/A'}, Status: {result.status}
          </li>
        ))}
      </ul>

      <h3>Lap Data</h3>
      <p>Click on a driver acronym to see their lap details in console:</p>
      <ul>
        {uniqueAcronyms.map((acronym, index) => (
          <li key={index} style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleDriverAcronymClick(acronym)}>
            {acronym}
          </li>
        ))}
      </ul>

      <h3>Tire Strategy</h3>
      <ul>
        {drivers.map((driver, index) => (
          <li key={index}>
            Driver Number: {driver.number}, Acronym: {driver.acronym}
            <ul>
              {driver.tires?.map((tire, tireIndex) => (
                <li key={tireIndex}>Lap End: {tire.lap_end}, Compound: {tire.compound}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h3>Starting Grid</h3>
      <ul>
        {startingGrid
          .sort((a, b) => a.position - b.position)
          .map((gridPosition, index) => (
            <li key={index}>
              Position: {gridPosition.position}, Driver: {driversDetails[gridPosition.driver_number]}
            </li>
          ))}
      </ul>

    </div>
  );
}