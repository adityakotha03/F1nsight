import React, { useEffect, useState } from 'react';
import { getDriverStandings } from '../utils/api';

import { ConstructorCard } from './ConstructorCard';

export function DriverStandings({ selectedYear }) {
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

  // console.log(standings);

  return (
    <div>
      <h2 className="heading-4 text-center mt-32">Driver Standings</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {standings.map((standing, index) => (
            <li key={index} className='w-full'>
              <ConstructorCard 
                type='drivers'
                image={standing.driverCode} 
                points={standing.points}
                name={standing.driverName}
                year={selectedYear} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
