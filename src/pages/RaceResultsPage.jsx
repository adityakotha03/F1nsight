import React, { useState, useEffect, useMemo } from "react";
import { fetchRaceDetails, fetchRaceMeetingKeys } from "../utils/api";
import classNames from "classnames";

import { RaceResultItem, Loading, Button } from "../components";
import { useNavigate } from "react-router-dom";

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
    if (!date || !time) return "TBA";

    // Combine date and time to form a full ISO 8601 date-time string
    const dateTimeString = `${date}T${time}`;

    const dateObject = new Date(dateTimeString);
    if (isNaN(dateObject.getTime())) {
      return "Invalid Date";
    }
    const optionsDate = { month: "numeric", day: "numeric", year: "numeric" };
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZoneName: "short",
    };
    const formattedDate = dateObject.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObject.toLocaleTimeString(undefined, optionsTime);

    const formattedTimeCapitalized = formattedTime
      .replace("am", "AM")
      .replace("pm", "PM");
    return `${formattedDate} ${formattedTimeCapitalized}`;
  };

  let navigate = useNavigate();
  const navigateToRaceResult = (race) => {
    // console.log(race);
    navigate(`/race/${races[race.raceName]?.["meeting_key"]}`);
  };

  const processedRaces = useMemo(() => {
    let effectiveRound = 1;
    return raceDetails.map(race => {
      return {
        ...race,
        displayRound: effectiveRound++
      };
    });
  }, [raceDetails]);

  return (
    <div className="standard-scroll-container">
      <div className="race-results max-w-[120rem] m-auto mt-32  pb-64">
      {isLoading ? (
        <Loading
          className="mt-[20rem] mb-[20rem]"
          message={`Loading ${selectedYear} Race Results`}
        />
      ) : (
        <ul className="race-result">
          {processedRaces.map((race, index) => (
            <li
              key={index}
              className={classNames(
                "bg-glow-dark rounded-[2.4rem] mt-[7.2rem] lg:mt-56 px-32 group duration-150 transition-transform ease-in-out relative",
                {
                  "hover:scale-[.98] hover:cursor-pointer": true,
                },
                `${race.raceName}`,
              )}
              onClick={() => {
                if (race.results && race.results.length > 0)
                  navigateToRaceResult(race);
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
                  <img alt="" src="/images/podium.png" width={324} />
                </div>
              )}
              <div className="text-center mb-8 mt-12">
                <div className="uppercase text-xs text-neutral-400 tracking-sm leading-none mb-4 mt-24">
                  {`Round ${race.displayRound}`}
                </div>
                <p className="font-display tracking-xs leading-none mb-4 font-bold">
                  {race.raceName}
                </p>
                <div className="text-xs text-neutral-400 tracking-sm leading-none">
                  {formatTime(race.date, race.time)}
                </div>
              </div>
              <Button
                size="sm"
                disabled
                className="opacity-0 group-hover:opacity-100 absolute bottom-[-.8rem] left-1/2 -translate-x-1/2"
              >
                View Race Data
              </Button>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}
