import React, { useEffect, useState } from 'react';
import { fetchRaceDetails, getConstructorStandings, getPartialConstructorStandings } from '../utils/api';

import { Button, ConstructorCar, Loading, RangeSelector } from '../components';
import { useNavigate } from 'react-router-dom';

export function ConstructorStandings({ selectedYear }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [reset, setReset] = useState(false);
  const [raceDetails, setRaceDetails] = useState(null);
  const [rangeOpen, setRangeOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getConstructorStandings(selectedYear);
      const data2 = await fetchRaceDetails(selectedYear);
      const data3 = data2.filter(race => (race.url))
      setRaceDetails(data3);
      // console.log(data3);
      setStandings(data);
      // console.log(data);
      // setEnd(data3.length);
      // setFilteredStandings(data);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear, reset]);

  useEffect(() => {
    const alterStandings = async () => {
      setIsLoading(true);
      if(parseInt(start)<parseInt(end) && start!==-1 && end!==-1){
        const data = await getPartialConstructorStandings(selectedYear,start,end);
        setStandings(data);
      }
      setIsLoading(false);
    }

    alterStandings();
    start > 0 || end > 0 ? setRangeOpen(true) : setRangeOpen(false);
  }, [start,end]);

  let navigate = useNavigate();
  const navigateToTeamComp = (constructorId) => {
    navigate(
      `/teammates-comparison/${selectedYear}/${constructorId}`
    );
  };

  return (
    <div className="max-w-[45rem] m-auto">
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Constructor Standings`} />
      ) : (
        <>
          <RangeSelector 
            className="-mt-24 pt-48 relative z-[90]"
            start={start}
            end={end}
            reset={reset}
            setEnd={setEnd}
            setStart={setStart}
            setReset={setReset}
            raceDetails={raceDetails}
            rangeOpen={rangeOpen}
          />
          <ul>
            {standings.map((standing, index) => (
              <li key={index} className='clickable-hover group -mb-32' onClick={()=> {navigateToTeamComp(standing.constructorId)}}>
                <ConstructorCar 
                  image={standing.constructorId} 
                  points={standing.points}
                  name={standing.constructorName}
                  year={selectedYear} 
                  drivers={standing.driverCodes}
                  index={index}
                  />
                  <Button size='sm' disabled className="opacity-0 group-hover:opacity-100 absolute bottom-[2.4rem] left-1/2 -translate-x-1/2">See Comparison</Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
