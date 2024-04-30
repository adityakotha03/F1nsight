import React, { useEffect, useState } from 'react';
import { getConstructorStandings } from '../utils/api';

import { ConstructorCar } from './ConstructorCar';
import { Loading } from "./Loading"

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

  return (
    <div className="sm:max-w-7xl sm:mx-auto pt-[22rem] sm:pt-[9.6rem]">
      <h2 className="heading-2 text-center mb-64 text-neutral-500">Driver Standings</h2>
      {isLoading ? (
        <Loading />
      ) : (
      <ul>
        {standings.map((standing, index) => (
          <li key={index}>
            <ConstructorCar 
              image={standing.constructorId} 
              points={standing.points}
              name={standing.constructorName}
              year={selectedYear} 
              drivers={standing.driverCodes}
            />
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}
