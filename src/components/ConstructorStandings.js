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
    <>
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
    </>
  );
}
