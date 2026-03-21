import React, { useEffect, useRef, useState } from "react";
import ConstructorStandings from "./ConstructorStandings";
import DriverStandings from "./DriverStandings";
import StartingGrid from "./StartingGrid";
import RaceResults from "./RaceResults";

import "./SocialMedia.scss";
import { fetchMostRecentRace } from "../../utils/api";
import { getRaceWeekendResults } from "./api";
import { getCurrentYear } from "../../utils/currentYear";

const currentYear = getCurrentYear();

const SocialMedia = () => {
    const [weekendResults, setWeekendResults] = useState(null);
    const [recentRaceWeekend, setRecentRaceWeekend] = useState(null); 
    const [isWeekendLoading, setIsWeekendLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    const fetchData = async () => {
        setIsWeekendLoading(true);
        const mostRecentRaceWeekend = await fetchMostRecentRace(currentYear);

        console.log('mostRecentRaceWeekend', mostRecentRaceWeekend);

        if (mostRecentRaceWeekend?.meetingKey) {
            const results = await getRaceWeekendResults(
                mostRecentRaceWeekend.meetingKey,
            );
            setWeekendResults(results);
            setRecentRaceWeekend(mostRecentRaceWeekend);
        }
        setIsWeekendLoading(false);
    };

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        fetchData();
    }, []);

    console.log('weekendResults', weekendResults);
    console.log('recentRaceWeekend', recentRaceWeekend);

    return (
        <div className="flex flex-col gap-32 items-center py-96">
            <h1>Social Media Dashboard</h1>
            {isWeekendLoading && (
                <div className="flex flex-col md:flex-row gap-32">
                    <StartingGrid
                        raceName={recentRaceWeekend?.raceName}
                        startingGrids={[]}
                        isLoading
                    />
                    <RaceResults
                        raceName={recentRaceWeekend?.raceName}
                        raceResults={[]}
                        isLoading
                    />
                </div>
            )}
            {weekendResults && weekendResults.map((race, index) => (
                <div key={race.session_key} className="flex flex-col md:flex-row gap-32">
                    <StartingGrid raceName={recentRaceWeekend.raceName} startingGrids={[race]} />
                    <RaceResults raceName={recentRaceWeekend.raceName} raceResults={[race]} />
                </div>
            ))}
            <div className="flex flex-col md:flex-row gap-32">
                <ConstructorStandings raceName={recentRaceWeekend?.raceName} location={recentRaceWeekend?.Circuit.Location.locality} round={recentRaceWeekend?.round} />
                <DriverStandings raceName={recentRaceWeekend?.raceName} location={recentRaceWeekend?.Circuit.Location.locality} round={recentRaceWeekend?.round} />
            </div>
        </div>
    );
};

export default SocialMedia;
