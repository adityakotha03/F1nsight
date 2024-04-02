import React, { useState, useEffect } from 'react';
import { fetchRaceDetails } from '../utils/api';

import { DriverCard } from './DriverCard';

function RaceResultsPage({ selectedYear }) {
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

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {raceDetails.map((race, index) => (
            <li key={index} className='py-32'>
              <h6 className='heading-6'>{race.raceName}, <strong>Date:</strong> {race.date}, <strong>Time:</strong> {race.time || 'TBA'}</h6>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RaceResultsPage;