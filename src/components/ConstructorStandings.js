import React, { useEffect, useState } from 'react';
import { getConstructorStandings } from '../utils/api';

import { ConstructorCard } from './ConstructorCard';

export function ConstructorStandings({ selectedYear }) {
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

  //console.log(standings);

  return (
    <div>
      <h2 className="heading-4 text-center mt-32">Constructor Points</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
      <ul>
        {standings.map((standing, index) => (
          <li key={index}>
            <ConstructorCard 
              type='cars'
              image={standing.constructorId} 
              points={standing.points}
              name={standing.constructorName}
              year={selectedYear} 
            />
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}
