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
    <div className="sm:max-w-5xl sm:mx-auto pt-[17rem] sm:pt-64">
      <h2 className="heading-2 text-center mb-64 mt-64 text-neutral-500">Driver Standings</h2>
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" />
      ) : (
        <ul>
          {standings.map((standing, index) => (
            <li key={index} className='w-full'>
              <ConstructorDriver 
                className="mt-32"
                image={standing.driverCode} 
                car={standing.constructorId}
                points={standing.points}
                firstName={standing.firstName}
                lastName={standing.lastName}
                year={selectedYear} 
                showDivider
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
