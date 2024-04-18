import React, { useEffect, useState } from 'react';
import { getDriverStandings } from '../utils/api';

import { ConstructorDriver } from './ConstructorDriver';
import { Loading } from "./Loading"


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
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <ul>
          {standings.map((standing, index) => (
            <li key={index} className='w-full'>
              <ConstructorDriver 
                image={standing.driverCode} 
                car={standing.constructorId}
                points={standing.points}
                firstName={standing.driverName.split(' ')[0]}
                lastName={standing.driverName.split(' ')[1]}
                year={selectedYear} 
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
