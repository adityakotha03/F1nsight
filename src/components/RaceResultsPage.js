import React, { useState, useEffect } from 'react';
import { fetchRaceDetails } from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DriverCard } from './DriverCard';
import { Loading } from "./Loading"


export function RaceResultsPage({ selectedYear }) {
  const [raceDetails, setRaceDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const details = await fetchRaceDetails(selectedYear);
      setRaceDetails(details);
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
  
// console.log(raceDetails);

  return (
    <div className="pt-[17rem] sm:pt-64">
      <h2 className="heading-2 text-center mb-64 mt-64 text-neutral-500">Race Results</h2>
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" />
      ) : (
        <ul className=''>
          {raceDetails.map((race, index) => (
            <li key={index} className='pb-48 max-sm:w-3/4 m-auto'>
              <div className='text-center mb-16'>
                <h6 className='heading-6 text-neutral-500 gradient-text-light'>
                  {race.season} {race.raceName}
                </h6>
                <div className='text-sm text-neutral-500 tracking-wide'>
                  {formatTime(race.date, race.time)}
                </div>
              </div>
              {race.results && race.results.length > 0 && (
                <>
                  <ul className="flex flex-col sm:flex-row align-center justify-center gap-20">
                    {race.results.map((result, resultIndex) => (
                      <DriverCard 
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
                      />
                    ))}
                  </ul>
                  <a className="text-sm block text-center mt-16 text-neutral-500" href="/">full weekend results <FontAwesomeIcon icon="fa-arrow-up-right-from-square" /></a>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
