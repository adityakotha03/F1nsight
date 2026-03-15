import React, { useEffect, useState } from 'react';
import { fetchRaceDetails, getDriverStandings, getPartialDriverStandings } from '../utils/api';

import { ConstructorDriver, Loading, RangeSelector } from '../components';

export function DriverStandings({ selectedYear }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [raceDetails, setRaceDetails] = useState(null);
  const [reset, setReset] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getDriverStandings(selectedYear);
      const data2 = await fetchRaceDetails(selectedYear);
      setRaceDetails(data2.filter(race => (race.url)))
      setStandings(data);
      // console.log(data);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear, reset]);

  useEffect(() => {
    const alterStandings = async () => {
      setIsLoading(true);
      if(parseInt(start)<parseInt(end) && start!==-1 && end!==-1){
        const data = await getPartialDriverStandings(selectedYear, start, end);
        // console.log(data);
        setStandings(data);
      }
      setIsLoading(false);
    }
    alterStandings();
    start > 0 || end > 0 ? setRangeOpen(true) : setRangeOpen(false);
  }, [start, end]);

  // console.log({start}, {end});
  return (
    <div className="max-w-[45rem] m-auto  pb-64">
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Driver Standings`} />
      ) : (
        <>
          <RangeSelector 
            start={start}
            end={end}
            reset={reset}
            setEnd={setEnd}
            setStart={setStart}
            setReset={setReset}
            raceDetails={raceDetails}
            className="-mt-24 pt-48 relative z-[90]"
            rangeOpen={rangeOpen}
          />
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
        </>
      )}
    </div>
  );
}
