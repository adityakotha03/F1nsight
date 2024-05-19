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
    <div className="global-container">
      <h2 className="heading-2 text-center mb-40 text-neutral-400">Driver Standings</h2>
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Driver Standings`} />
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
                index={index}
                showStanding
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
