import React, { useState, useEffect } from 'react';
import { fetchF1aRaceResultsByCircuit } from '../utils/api';
import classNames from 'classnames';

import { RaceResultItem, Loading } from '../components';
import { useNavigate } from 'react-router-dom';

const fetchCircuitData = async () => {
  try {
    const url = `https://ant-dot-comm.github.io/f1aapi/races/racesbyMK.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching circuit data:", error);
    return {};
  }
};

const Top3Drivers = ({ year, circuitId }) => {
  const [raceName, setRaceName] = useState('');
  const [top3RaceResults, setTop3RaceResults] = useState([]);
  const [top3RaceResults2, setTop3RaceResults2] = useState([]);
  console.log(year, circuitId);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchF1aRaceResultsByCircuit(year, circuitId, true);
      console.log('results', results);
      setRaceName(results.raceName);
      setTop3RaceResults(results.race1);
      setTop3RaceResults2(results.race2);
    };

    fetchData();
  }, [year, circuitId]);

  return (
    <div>
      <h1>Top 3 Drivers for {raceName}</h1>
      <h2>Race 1 Results</h2>
      <ul className="race-results__list -mt-48">
        {top3RaceResults.map((result, index) => (
          <RaceResultItem 
            className={`race-results__list__item-${index + 1}`}
            carNumber={result.number}
            driver={result.Driver}
            fastestLap={result.fastestLap}
            startPosition={parseInt(result.grid, 10)}
            key={index}
            index={index}
            endPosition={parseInt(result.position, 10)}
            status={result.status}
            time={result.time}
            year={year}
            wireframe={result.length === 0}
            f1a={true}
          />
        ))}
      </ul>
      <h2>Race 2 Results</h2>
      <ul className="race-results__list -mt-48">
        {top3RaceResults2.map((result, index) => (
          <RaceResultItem 
            className={`race-results__list__item-${index + 1}`}
            carNumber={result.number}
            driver={result.Driver}
            fastestLap={result.fastestLap}
            startPosition={parseInt(result.grid, 10)}
            key={index}
            index={index}
            endPosition={parseInt(result.position, 10)}
            status={result.status}
            time={result.time}
            year={year}
            wireframe={result.length === 0}
            f1a={true}
        />
        ))}
      </ul>
    </div>
  );
};


export function RaceResultsPageF1a({ selectedYear }) {
  const [year, setYear] = useState('2024');
  const [circuitData, setCircuitData] = useState({});
  const [filteredCircuits, setFilteredCircuits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCircuitData();
      setCircuitData(data);
      setFilteredCircuits(Object.values(data).filter(circuit => circuit.year === year));
    };

    fetchData();
  }, [year]);

  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setYear(selectedYear);
    setFilteredCircuits(Object.values(circuitData).filter(circuit => circuit.year === selectedYear));
  };
  
  return (
    <div className="race-results max-w-[120rem] m-auto mt-[12rem]">
      <label htmlFor="year">Select Year:</label>
      <select id="year" value={year} onChange={handleYearChange}>
        <option value={2023}>2023</option>
        <option value={2024}>2024</option>
      </select>

      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Race Results`} />
      ) : (
        filteredCircuits.map(circuit => (
          <Top3Drivers key={circuit.circuitId} year={year} circuitId={circuit.circuitId} />
        ))
      )}
    </div>
  );
}
