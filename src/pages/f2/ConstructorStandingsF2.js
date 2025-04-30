import React, { useEffect, useState } from 'react';

import { fetchAllRaceResults } from '../../utils/apiF1a';
import { ConstructorCar, Loading } from '../../components';
import {wildCardDrivers} from '../../utils/wildCards';
import { calculateSeriesPoints2025 } from '../../utils/calculateSeriesPoints2025';


export function ConstructorStandingsF2({ selectedYear, championshipLevel }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const allRaceResults = await fetchAllRaceResults(selectedYear, championshipLevel);
      // console.log({allRaceResults});

      const { formattedConstructors } = calculateSeriesPoints2025(allRaceResults, championshipLevel);
      setStandings(formattedConstructors);
      
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div className="max-w-[45rem] m-auto mt-48  pb-64">
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Constructor Standings`} />
      ) : (
        <ul>
          {standings.map((standing, index) => (
            <li key={index} className='-mb-32'>
              <ConstructorCar 
                image={standing.constructorId} 
                points={standing.points}
                name={standing.name}
                year={selectedYear} 
                drivers={standing.driverCodes}
                index={index}
                championshipLevel="f2"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
