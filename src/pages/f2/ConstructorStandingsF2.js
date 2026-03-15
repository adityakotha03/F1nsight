import React, { useEffect, useState } from 'react';

import { fetchAllRaceResults } from '../../utils/apiF1a';
import { ConstructorCar, Loading } from '../../components';
import { calculateSeriesPoints2025 } from '../../utils/calculateSeriesPoints2025';
import { PointsByRaceDropdown } from '../../components/PointsByRaceDropdown';
import { buildRacePointsMaps } from '../../utils/pointsByRace';


export function ConstructorStandingsF2({ selectedYear, championshipLevel }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [constructorRacePoints, setConstructorRacePoints] = useState(new Map());
  const [racesMeta, setRacesMeta] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const allRaceResults = await fetchAllRaceResults(selectedYear, championshipLevel);
      const { racesMeta, constructorPointsByRace } = buildRacePointsMaps(allRaceResults);
      setConstructorRacePoints(constructorPointsByRace);
      setRacesMeta(racesMeta);
      // console.log({allRaceResults});

      const { formattedConstructors } = calculateSeriesPoints2025(allRaceResults, championshipLevel);
      setStandings(formattedConstructors);
      
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear, championshipLevel]);

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
          {/* TODO: fix points by race dropdown */}
          {/* <PointsByRaceDropdown
            title="Points by race"
            racesMeta={racesMeta}
            pointsByRace={constructorRacePoints.get(standing.constructorId) || []}
          /> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
