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
    <div className="sm:max-w-5xl sm:mx-auto pt-[22rem] sm:pt-[9.6rem]">
      <h2 className="heading-2 text-center mb-64 text-neutral-500">Driver Standings</h2>
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
                firstName={standing.firstName}
                lastName={standing.lastName}
                year={selectedYear} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
