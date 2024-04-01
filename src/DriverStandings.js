import React, { useEffect, useState } from 'react';
import { getDriverStandings } from './api';

function DriverStandings({ selectedYear }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getDriverStandings(selectedYear);
      setStandings(data);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div>
      <h2>Driver Standings</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {standings.map((standing, index) => (
            <li key={index}>
              <strong>Position:</strong> {index + 1}, <strong>Driver:</strong> {standing.driverName}, <strong>Constructor:</strong> {standing.constructorName}, <strong>Points:</strong> {standing.points}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DriverStandings;