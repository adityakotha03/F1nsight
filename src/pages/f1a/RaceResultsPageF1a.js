import React, { useState, useEffect } from 'react';
import { fetchF1aRaceResultsByCircuit } from '../../utils/apiF1a';

import { RaceResultItem, Loading, Select } from '../../components';
import { NavLink } from 'react-router-dom';

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

const Top3Drivers = ({ year, circuitId, index }) => {
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
    <NavLink to={`/race-f1a/2024${index}`} className="bg-glow-dark rounded-[2.4rem] p-32 block mt-32 clickable-hover w-fit m-auto">
      <h3 className='font-display tracking-xs leading-none text-center font-bold mb-32'>{raceName}</h3>
      <div className="flex flex-col md:flex-row items-center md:justify-center gap-16">
        <div>
          <p className="uppercase text-sm text-center text-neutral-400 tracking-sm leading-none mb-24">Race 1 Results</p>
          {top3RaceResults && top3RaceResults.length > 0 ? (
            <ul className="bg-glow-dark rounded-[2.4rem] race-results__list">
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
                  time={result.Time.time}
                  year={year}
                  wireframe={result.length === 0}
                  f1a={true}
                  hasHover={false}
                />
              ))}
            </ul>
          ) : (
            <div className="flex justify-center">
              <img alt="" src={`${process.env.PUBLIC_URL + "/images/podium.png"}`} width={324} />
            </div>
          )}
        </div>
        <div>
          <p className="uppercase text-sm text-center text-neutral-400 tracking-sm leading-none mb-24">Race 2 Results</p>
          {top3RaceResults && top3RaceResults.length > 0 ? (
            <ul className="bg-glow-dark rounded-[2.4rem] race-results__list">
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
                  time={result.Time.time}
                  year={year}
                  wireframe={result.length === 0}
                  f1a={true}
              />
              ))}
            </ul>
          ) : (
            <div className="flex justify-center">
              <img alt="" src={`${process.env.PUBLIC_URL + "/images/podium.png"}`} width={324} />
            </div>
          )}
        </div>
      </div>
    </NavLink>
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

  // const handleYearChange = (event) => {
  //   const selectedYear = event.target.value;
  //   setYear(selectedYear);
  //   setFilteredCircuits(Object.values(circuitData).filter(circuit => circuit.year === selectedYear));
  // };
  
  return (
    <div className="race-results max-w-[120rem] m-auto mt-[12rem]">
      {/* <Select className="m-auto w-fit" label="Year" value={year} onChange={handleYearChange}>
        <option value={2023}>2023</option>
        <option value={2024}>2024</option>
      </Select> */}

      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Race Results`} />
      ) : (
        filteredCircuits.map((circuit, index) => (
          <Top3Drivers key={circuit.circuitId} year={year} index={index+1} circuitId={circuit.circuitId} />
        ))
      )}
    </div>
  );
}
