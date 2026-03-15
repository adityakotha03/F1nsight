import React, { useEffect, useState } from 'react';
import { fetchAllRaceResults } from '../../utils/apiF1a';
import { calculateSeriesPoints2025 } from '../../utils/calculateSeriesPoints2025';
import { ConstructorDriver, Loading } from '../../components';
import { PointsByRaceDropdown } from '../../components/PointsByRaceDropdown';
import { buildRacePointsMaps } from '../../utils/pointsByRace';

export function DriverStandingsF1a({ selectedYear, championshipLevel }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [driverRacePoints, setDriverRacePoints] = useState(new Map());
  const [racesMeta, setRacesMeta] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const allRaceResults = await fetchAllRaceResults(selectedYear.toString(), championshipLevel);
      const { racesMeta, driverPointsByRace } = buildRacePointsMaps(allRaceResults);
      setDriverRacePoints(driverPointsByRace);
      setRacesMeta(racesMeta);

      if (selectedYear === 2025) {
        const { formattedDrivers } = calculateSeriesPoints2025(allRaceResults, championshipLevel);
        setStandings(formattedDrivers);
      } else {
        const driverPoints = {};
        // Aggregate points for each driver
        allRaceResults.forEach(race => {
          ['race1', 'race2', 'race3'].forEach(raceKey => {
            race[raceKey].forEach(result => {
              const driverId = result.Driver.driverId;
              const points = parseInt(result.points, 10);

              if (!driverPoints[driverId]) {
                driverPoints[driverId] = {
                  ...result.Driver,
                  points: 0
                };
              }
              driverPoints[driverId].points += points;
            });
          });
        });
        // Convert to array and sort by points in descending order
        const sortedDrivers = Object.values(driverPoints).sort((a, b) => b.points - a.points);
        setStandings(sortedDrivers);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear, championshipLevel]);

  // console.log('DriverStandingsF1a', standings);

  return (
    <div className="max-w-[45rem] m-auto mt-64  pb-64">
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Driver Standings`} />
      ) : (
          <ul>
            {standings.map((standing, index) => (
              <li key={index} className='w-full'>
                <ConstructorDriver 
                  className="mt-32"
                  image={standing.code} 
                  car={standing.constructorId}
                  points={standing.points}
                  firstName={standing.givenName}
                  lastName={standing.familyName}
                  year={selectedYear} 
                  showDivider
                  index={index}
                  showStanding
                  championshipLevel={championshipLevel}
                />
                {/* TODO: fix points by race dropdown */}
                {/* <PointsByRaceDropdown
                  title="Points by race"
                  racesMeta={racesMeta}
                  pointsByRace={driverRacePoints.get(standing.driverId) || []}
                /> */}
              </li>
            ))}
          </ul>
      )}
    </div>
  );
}
