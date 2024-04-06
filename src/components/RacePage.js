import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { fetchDriversAndTires, fetchCircuitIdByCountry, fetchRaceResultsByCircuit } from '../utils/api';
import { DriverCard } from './DriverCard';
import { TireStrategyCard } from './TireStrategyCard';
import { fetchLocationData } from '../utils/api';
import {ThreeCanvas} from './ThreeCanvas.js'

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
          const endTime = '2024-03-02T16:10';
          const scaleFactor = 1000;
          try {
            const locationData = await fetchLocationData(sessionKey, driverId, startTime, endTime, scaleFactor);
            setlocData(locationData);
            console.log(locationData); // Log the fetched and processed location data
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
  }, [meetingKey, year, country, circuitId]);

  const prepareChartData = () => {
    const driverAcronyms = [...new Set(laps.map(lap => driversDetails[lap.driver_number]))];
    const lapNumbers = [...new Set(laps.map(lap => lap.lap_number))].sort((a, b) => a - b);
  
    return lapNumbers.map(lapNumber => {
      const lapDataForAllDrivers = { name: `Lap ${lapNumber}` };
  
      driverAcronyms.forEach(acronym => {
        const lapForDriver = laps.find(lap => lap.lap_number === lapNumber && driversDetails[lap.driver_number] === acronym);
        if (lapForDriver && !isNaN(lapForDriver.lap_duration) && parseFloat(lapForDriver.lap_duration) > 0) {
          lapDataForAllDrivers[acronym] = parseFloat(lapForDriver.lap_duration);
        }
      });
  
      return Object.keys(lapDataForAllDrivers).length > 1 ? lapDataForAllDrivers : null;
    }).filter(lapData => lapData !== null);
  };
  
  const chartData = prepareChartData();
  
  // Determine the minimum and maximum lap durations, with a buffer for the Y-axis domain
  const minLapDuration = Math.min(...chartData.flatMap(lap => Object.values(lap).slice(1)));
  const maxLapDuration = Math.max(...chartData.flatMap(lap => Object.values(lap).slice(1)));
  const yAxisPadding = (maxLapDuration - minLapDuration) * 0.05; // 5% padding for example
  // Calculate adjusted domain values with 3 decimal places
  const minYAxisValue = parseFloat((minLapDuration - yAxisPadding).toFixed(3));
  const maxYAxisValue = parseFloat((maxLapDuration + yAxisPadding).toFixed(3));


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
        <h3 className="heading-3">3D Track Visualization</h3>
          <ThreeCanvas imageFile="/maps/map.png" locData = {locData}/>
          <h3 className="heading-3">Lap Data</h3>
          <p>View the lap duration for each driver below:</p>
          <LineChart
            width={1000}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[minYAxisValue, maxYAxisValue]} />
            <Tooltip />
            <Legend />
            {[...new Set(laps.map(lap => lap.driver_acronym))].map((acronym, index) => (
              <Line key={index} type="monotone" dataKey={acronym} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            ))}
          </LineChart>
        
      


      <h3 className="heading-3">Tire Strategy</h3>
      <div>
        {drivers.map((driver, index) => (
          <TireStrategyCard key={index} driver={driver.acronym} tires={driver.tires} />
        ))}
      </div>
      </div>
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
          .filter(result => result.FastestLap && result.FastestLap.rank)
          .sort((a, b) => parseInt(a.FastestLap.rank) - parseInt(b.FastestLap.rank))
          .map((result, index) => (
            <li key={index}>
              Rank: {result.FastestLap.rank}, Lap: {result.FastestLap.lap}, Time: {result.FastestLap.Time.time}, Driver Name: {result.Driver.code}, Constructor: {result.Constructor.name}
            </li>
          ))}
      </ul>


    </div>
  );
}