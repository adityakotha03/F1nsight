import React, { useState, useEffect } from 'react';
import { fetchRaceDetails, fetch, fetchRaceMeetingKeys } from '../utils/api';
import classNames from 'classnames';

import { RaceResultItem, Loading, Button } from '../components';
import { useNavigate } from 'react-router-dom';
import { trackButtonClick } from '../utils/gaTracking';


export function RaceResultsPage({ selectedYear }) {
  const [raceDetails, setRaceDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [races, setRaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const details = await fetchRaceDetails(selectedYear);
      const races = await fetchRaceMeetingKeys(selectedYear);
      // console.log('details', races) 

      setRaceDetails(details);
      setRaces(races);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear]);

  const formatTime = (date, time) => {
    if (!date || !time) return 'TBA';

    // Combine date and time to form a full ISO 8601 date-time string
    const dateTimeString = `${date}T${time}`;

    const dateObject = new Date(dateTimeString);
    if (isNaN(dateObject.getTime())) {
      return 'Invalid Date';
    }
    const optionsDate = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' };
    const formattedDate = dateObject.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObject.toLocaleTimeString(undefined, optionsTime);

    const formattedTimeCapitalized = formattedTime.replace('am', 'AM').replace('pm', 'PM');
    return `${formattedDate} ${formattedTimeCapitalized}`;
  };

  let navigate = useNavigate();
  const navigateToRaceResult = (race) => {
    // console.log(race);
    navigate(
      `/race/${races[race.raceName]['meeting_key']}`
    );
  }
  
  return (
    <div className="race-results max-w-[120rem] m-auto mt-32  pb-64">
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Race Results`} />
      ) : (
        <ul className="race-result">
          {raceDetails.map((race, index) => (
            <li 
              key={index}
              className={classNames(
                  "bg-glow-dark rounded-[2.4rem] mt-[7.2rem] lg:mt-56 px-32 group duration-150 transition-transform ease-in-out hover:scale-[.98] hover:cursor-pointer",
                  `${race.raceName}`
              )}
              onClick={()=>{
                if(race.results && race.results.length >0 ) navigateToRaceResult(race)
                trackButtonClick(`race-result-item-${race.raceName}`)
              }}
            >
              {race.results && race.results.length > 0 ? (
                <ul className="race-results__list -mt-48 group-hover:scale-[1.10] duration-150 transition-transform ease-in-out">
                  {race.results.map((result, resultIndex) => (
                      <RaceResultItem 
                        className={`race-results__list__item-${resultIndex + 1}`}
                        carNumber={result.number}
                        driver={result.driver}
                        fastestLap={result.fastestLap}
                        startPosition={parseInt(result.grid, 10)}
                        key={resultIndex}
                        index={resultIndex}
                        endPosition={parseInt(result.position, 10)}
                        status={result.status}
                        time={result.time}
                        year={selectedYear}
                        wireframe={race.results.length === 0}
                      />
                  ))}
                </ul>
              ) : (
                <div className="flex justify-center -mt-48">
                  <img alt="" src={`${process.env.PUBLIC_URL + "/images/podium.png"}`} width={324} />
                </div>
              )}
              <div className='text-center mb-8 mt-12'>
                <div className='uppercase text-xs text-neutral-400 tracking-sm leading-none mb-4 mt-24'>
                  {`Round ${index + 1}`}
                </div>
                <p className='font-display tracking-xs leading-none mb-4 font-bold'>
                  {race.raceName}
                </p>
                <div className='text-xs text-neutral-400 tracking-sm leading-none'>
                  {formatTime(race.date, race.time)}
                </div>
              </div>
              {/* <div className={classNames("divider-glow-medium mb-16",  {"mt-32" : !race.results})} /> */}
              <Button size='sm' disabled className="opacity-0 group-hover:opacity-100 absolute bottom-[-.8rem] left-1/2 -translate-x-1/2">View Race Data</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
