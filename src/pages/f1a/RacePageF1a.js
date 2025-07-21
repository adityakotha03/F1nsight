import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchDriversAndTires } from "../../utils/api.js";
import { fetchRaceResultsByCircuit } from "../../utils/apiF1a.js";

import {
    DriverCard,
    StartingGridF1A,
    FastestLapsF1A,
} from "../../components/index.js";

export function RacePageF1a({championshipLevel}) {
    const { state } = useLocation();
    const { raceId } = useParams();
    const [raceName, setRaceName] = useState(state ? state.raceName : null);
    const [meetingKey, setMeetingKey] = useState(
        state ? state.meetingKey : raceId
    );
    const [year, setYear] = useState(state ? state.year : null);
    const [location, setLocation] = useState(state ? state.location : null);
    const [circuitId, setCircuitId] = useState(state ? state.location : null);
    const [drivers, setDrivers] = useState([]);
    const [raceResults0, setRaceResults0] = useState([]);
    const [raceResults, setRaceResults] = useState([]);
    const [raceResults2, setRaceResults2] = useState([]);
    const [raceResults3, setRaceResults3] = useState([]);
    const [activeButtonIndex, setActiveButtonIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const setBaseData = async () => {
            setRaceName(state.raceName);
            setYear(state.year);
            setLocation(state.location);
            setCircuitId(state.circuitId);
            setMeetingKey(state.meetingKey);
        };
        if (state) setBaseData();
    }, [state]);

    useEffect(() => {
        const fetchByMeetingKey = async () => {
            const response = await fetch(
                `https://ant-dot-comm.github.io/f1aapi/races/racesbyMK.json`
            ).then((res) => res.json());
            setYear(response[raceId]["year"]);
            setLocation(response[raceId]["location"]);
            setCircuitId(response[raceId]["circuitId"]);
            setRaceName(response[raceId]["raceName"]);
            // console.log('fetchByMeetingKey', response[raceId]);
        };
        if (raceName) {
        } else {
            fetchByMeetingKey();
        }
    }, []);

    // console.log(raceName, year, location, meetingKey);

    const fetchData = async () => {
        if (!raceName) return;

        try {
            setIsLoading(true);
            
            if (circuitId) {
                const results = await fetchRaceResultsByCircuit(
                    year,
                    circuitId,
                    false,
                    championshipLevel
                );
                // console.log("results", results);
                setRaceResults0(results.race0);
                setRaceResults(results.race1);
                setRaceResults2(results.race2);
                setRaceResults3(results.race3);
                // console.log("setRaceResults", results);
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [year, circuitId, raceName]);

    // Sort raceResults by endPosition (ascending order)
    raceResults0.sort(
        (a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)
    );
    raceResults.sort(
        (a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)
    );
    raceResults2.sort(
        (a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)
    );
    raceResults3.sort(
        (a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)
    );

    // console.log('racepagef1a', championshipLevel);

    return (
        <>
            <p class="text-sm tracking-sm mt-[4rem] text-center">{year}</p>
            <h1 className="heading-1 text-center">{raceName}</h1>
            <p class="text-sm tracking-sm text-center">{location}</p>

            <div className="mt-[6.4rem] divider-glow-dark -mb-16 relative z-10" />

            <div className="flex flex-col md:flex-row">
                {/* race 0 rescheduled race */}
                {raceResults0.length > 0 && (
                    <div className="flex flex-col items-center md:w-1/2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-32">
                        <p className="heading-2 mb-32">Rescheduled Race</p>

                        <div className="bg-glow-large p-24 rounded-lg w-[25rem] mb-32">
                            {raceResults0.map((result, index) => (
                                <DriverCard
                                    hasHover
                                    isActive={activeButtonIndex === index}
                                    index={index}
                                    driver={result.Driver}
                                    stint={drivers}
                                    startPosition={parseInt(result.grid, 10)}
                                    endPosition={parseInt(result.position, 10)}
                                    year={year}
                                    time={result.Time?.time || result.status}
                                    fastestLap={result.FastestLap}
                                    layoutSmall={index > 2}
                                    championshipLevel={championshipLevel}
                                />
                            ))}
                        </div>

                        <StartingGridF1A raceResults={raceResults0} year={year} />

                        <div className="page-container-centered">
                            <FastestLapsF1A
                                raceResults={raceResults0}
                                drivers={drivers}
                            />
                        </div>
                    </div>
                )}
                
                {/* race 1 */}
                <div className="flex flex-col items-center md:w-1/2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-32">
                    <p className="heading-2 mb-32">Race 1</p>

                    <div className="bg-glow-large p-24 rounded-lg w-[25rem] mb-32">
                        {raceResults.map((result, index) => (
                            <DriverCard
                                hasHover
                                isActive={activeButtonIndex === index}
                                index={index}
                                driver={result.Driver}
                                stint={drivers}
                                startPosition={parseInt(result.grid, 10)}
                                endPosition={parseInt(result.position, 10)}
                                year={year}
                                time={result.Time?.time || result.status}
                                fastestLap={result.FastestLap}
                                layoutSmall={index > 2}
                                championshipLevel={championshipLevel}
                            />
                        ))}
                    </div>

                    <StartingGridF1A raceResults={raceResults} year={year} />

                    <div className="page-container-centered">
                        <FastestLapsF1A
                            raceResults={raceResults}
                            drivers={drivers}
                        />
                    </div>
                </div>

                {/* Race 2 */}
                {raceResults2.length > 0 && (
                    <div className="flex flex-col items-center md:w-1/2 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 p-32">
                        <p className="heading-2 mb-32">Race 2</p>
                        <div className="bg-glow-large p-24 rounded-lg w-[25rem] mb-32">
                            {raceResults2.map((result, index) => (
                                <DriverCard
                                    hasHover
                                    isActive={activeButtonIndex === index}
                                    index={index}
                                    driver={result.Driver}
                                    stint={drivers}
                                    startPosition={parseInt(
                                        result.grid,
                                        10
                                    )}
                                    endPosition={parseInt(
                                        result.position,
                                        10
                                    )}
                                    year={year}
                                    time={
                                        result.Time?.time || result.status
                                    }
                                    fastestLap={result.FastestLap}
                                    layoutSmall={index > 2}
                                    championshipLevel={championshipLevel}
                                />
                            ))}
                        </div>

                        <StartingGridF1A raceResults={raceResults2} year={year} />

                        <div className="page-container-centered">
                            <FastestLapsF1A
                                raceResults={raceResults2}
                                drivers={drivers}
                            />
                        </div>
                    </div>
                )}
                
                {/* Race 3 */}
                {raceResults3.length > 0 && (
                    <div className="flex flex-col items-center md:w-1/2 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 p-32">
                        <p className="heading-2 mb-32">Race 3</p>
                        <div className="bg-glow-large p-24 rounded-lg w-[25rem] mb-32">
                            {raceResults3.map((result, index) => (
                                <DriverCard
                                    hasHover
                                    isActive={activeButtonIndex === index}
                                    index={index}
                                    driver={result.Driver}
                                    stint={drivers}
                                    startPosition={parseInt(
                                        result.grid,
                                        10
                                    )}
                                    endPosition={parseInt(
                                        result.position,
                                        10
                                    )}
                                    year={year}
                                    time={
                                        result.Time?.time || result.status
                                    }
                                    fastestLap={result.FastestLap}
                                    layoutSmall={index > 2}
                                    championshipLevel={championshipLevel}
                                />
                            ))}
                        </div>

                        <StartingGridF1A raceResults={raceResults3} year={year} />

                        <div className="page-container-centered">
                            <FastestLapsF1A
                                raceResults={raceResults3}
                                drivers={drivers}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
