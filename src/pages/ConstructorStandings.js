import React, { useEffect, useState } from 'react';
import { getConstructorStandings } from '../utils/api';

import { ConstructorCar, Loading } from '../components';
import { useNavigate } from 'react-router-dom';

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

  let navigate = useNavigate();
  const navigateToTeamComp = (constructorId) => {
    navigate(
      '/teammates-comparison',
      {
        state: {
          constructorId : constructorId,
          selectedYear: selectedYear
        }
      }
    );
  };

  return (
    <div className="max-w-[45rem] m-auto">
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Constructor Standings`} />
      ) : (
      <ul>
        {standings.map((standing, index) => (
          <li key={index} className='clickable-hover' onClick={()=> {navigateToTeamComp(standing.constructorId)}}>
            <ConstructorCar 
              image={standing.constructorId} 
              points={standing.points}
              name={standing.constructorName}
              year={selectedYear} 
              drivers={standing.driverCodes}
              index={index}
            />
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}
