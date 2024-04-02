import React, { useEffect, useState } from 'react';
import { getConstructorStandings } from '../utils/api';

function ConstructorStandings({ selectedYear }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getConstructorStandings(selectedYear);
      setStandings(data);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div>
      <h2>Constructor Points</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
      <ul>
        {standings.map((standing, index) => (
          <li key={index}>
            Constructor: {standing.constructorName}, Points: {standing.points}
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

export default ConstructorStandings;
