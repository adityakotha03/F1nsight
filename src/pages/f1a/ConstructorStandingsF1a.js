import React, { useEffect, useState } from 'react';

import { fetchAllRaceResults } from '../../utils/apiF1a';
import { ConstructorCarF1a, Loading } from '../../components';
import { wildCardDrivers } from '../../utils/wildCards';
import { calculateSeriesPoints2025 } from '../../utils/calculateSeriesPoints2025';
import { PointsByRaceDropdown } from '../../components/PointsByRaceDropdown';
import { buildRacePointsMaps } from '../../utils/pointsByRace';


export function ConstructorStandingsF1a({ selectedYear, championshipLevel }) {
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

      if (selectedYear === 2025) {
        const { formattedConstructors } = calculateSeriesPoints2025(allRaceResults, championshipLevel);
        setStandings(formattedConstructors);
      } else {
        const constructorPoints = {};
        // Aggregate points for each constructor and store driver codes
        allRaceResults.forEach(race => {
          ['race1', 'race2', 'race3'].forEach(raceKey => {
            race[raceKey].forEach(result => {
              const constructorId = result.Constructor.constructorId;
              const points = parseInt(result.points, 10);
              const driverCode = result.Driver.code;

              if (wildCardDrivers[selectedYear] && wildCardDrivers[selectedYear].includes(driverCode)) {
                console.log(`Skipping wild card driver ${driverCode} for constructor ${constructorId}`);
                return;
              }

              if (!constructorPoints[constructorId]) {
                constructorPoints[constructorId] = {
                  ...result.Constructor,
                  points: 0,
                  driverCodes: new Set() // Use a Set to avoid duplicate codes
                };
              }
              constructorPoints[constructorId].points += points;
              constructorPoints[constructorId].driverCodes.add(driverCode);
            });
          });
        });
        // Convert driver codes from Set to array
        Object.keys(constructorPoints).forEach(constructorId => {
          constructorPoints[constructorId].driverCodes = Array.from(constructorPoints[constructorId].driverCodes);
        });
        // Convert to array and sort by points in descending order
        const sortedConstructors = Object.values(constructorPoints).sort((a, b) => b.points - a.points);
        // console.log('ConstructorStandingsF1a', sortedConstructors, constructorDrivers);
        setStandings(sortedConstructors);
      }
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
              <ConstructorCarF1a 
                image={standing.constructorId} 
                points={standing.points}
                name={standing.name}
                year={selectedYear} 
                drivers={standing.driverCodes}
                index={index}
                f1a
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
