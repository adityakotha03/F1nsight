import React, { useState, useEffect } from 'react';
import { fetchRaceDetails } from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DriverCard } from './DriverCard';

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
    <div>
      <h2 className="heading-4 text-center mt-32">{selectedYear} Race Results</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {raceDetails.map((race, index) => (
            <li key={index} className='py-32'>
              <div className='text-center'>
                <h6 className='heading-6'>
                  {race.raceName}
                </h6>
                <div className='text-sm text-neutral-500'>
                  {race.date}
                  <span className="ml-8">{race.time || 'TBA'}</span>
                </div>
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
                      position={result.position}
                      status={result.status}
                      time={result.time}
                      year={selectedYear}
                    />
                  ))}
                </ul>
              )}
              <a className="text-sm block text-center mt-16" href="/">full weekend results <FontAwesomeIcon icon="fa-arrow-up-right-from-square" /></a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
