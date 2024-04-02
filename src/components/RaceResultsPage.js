import React, { useState, useEffect } from 'react';
import { fetchRaceDetails } from '../utils/api';

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
            <li key={index}>
              <strong>Race:</strong> {race.raceName}, <strong>Date:</strong> {race.date}, <strong>Time:</strong> {race.time || 'TBA'}
              {race.results && race.results.length > 0 && (
                <ul>
                  {race.results.map((result, resultIndex) => (
                    <li key={resultIndex}>
                      {resultIndex + 1}. Driver: {result.driver}, Time: {result.time}
                    </li>
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