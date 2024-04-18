import React, { useState, useEffect } from 'react';
import { fetchRaceDetails } from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DriverCard } from './DriverCard';
import { Loading } from "./Loading"


export function RaceResultsPage({ selectedYear }) {
  const [raceDetails, setRaceDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const details = await fetchRaceDetails(selectedYear);
      setRaceDetails(details);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear]);

// console.log(raceDetails);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <ul className=''>
          {raceDetails.map((race, index) => (
            <li key={index} className='pb-48 max-sm:w-3/4 m-auto'>
              <div className='text-center'>
                <h6 className='heading-6 text-neutral-500 mb-16'>
                  {race.season} {race.raceName}
                </h6>
                {/* <div className='text-sm text-neutral-500'>
                  {race.date}
                  <span className="ml-8">{race.time || 'TBA'}</span>
                </div>*/}
              </div>
              {race.results && race.results.length > 0 && (
                <ul className="flex flex-col sm:flex-row align-center justify-center gap-20">
                  {race.results.map((result, resultIndex) => (
                    <DriverCard 
                      carNumber={result.number}
                      driver={result.driver}
                      fastestLap={result.fastestLap}
                      grid={result.grid}
                      key={resultIndex}
                      position={parseInt(result.position, 10)}
                      status={result.status}
                      time={result.time}
                      year={selectedYear}
                    />
                  ))}
                </ul>
              )}
              <a className="text-sm block text-center mt-16 text-neutral-500" href="/">full weekend results <FontAwesomeIcon icon="fa-arrow-up-right-from-square" /></a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
