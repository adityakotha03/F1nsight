import React, { useEffect, useState } from 'react';
import { getDriverStandings } from '../utils/api';

import { ConstructorDriver, Loading } from '../components';

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

  return (
    <div className="max-w-[120rem] m-auto">
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