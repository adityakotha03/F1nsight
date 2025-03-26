import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchDriversAndTires } from "../../utils/api.js";
import { fetchF1aRaceResultsByCircuit } from "../../utils/apiF1a.js";

import {
    DriverCard,
    StartingGridF1A,
    FastestLapsF1A,
} from "../../components/index.js";

export function RacePageF1a() {
    const { state } = useLocation();
    const { raceId } = useParams();
    const [raceName, setRaceName] = useState(state ? state.raceName : null);
    const [meetingKey, setMeetingKey] = useState(
        state ? state.meetingKey : raceId
    );
    const [year, setYear] = useState(state ? state.year : null);
    const [location, setLocation] = useState(state ? state.location : null);
    const [drivers, setDrivers] = useState([]);
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
            setActiveButtonIndex(null);

            const locationMap = {
                Melbourne: "albert_park",
                Austin: "americas",
                Sakhir: "bahrain",
                Baku: "baku",
                Budapest: "hungaroring",
                Imola: "imola",
                "São Paulo": "interlagos",
                Jeddah: "jeddah",
                "Marina Bay": "marina_bay",
                Monaco: "monaco",
                Spielberg: "red_bull_ring",
                "Mexico City": "rodriguez",
                Shanghai: "shanghai",
                Silverstone: "silverstone",
                "Spa-Francorchamps": "spa",
                Suzuka: "suzuka",
                "Las Vegas": "vegas",
                Montréal: "villeneuve",
                Zandvoort: "zandvoort",
                Miami: "miami",
                Monza: "monza",
                Barcelona: "catalunya",
                Lusail: "lusail",
                "Yas Island": "yas_marina",
            };

            setIsLoading(true);

            const circuitId = locationMap[location];
            // console.log("circuitId", circuitId);
            const sessionsResponse = await fetch(
                `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`
            );
            const sessionsData = await sessionsResponse.json();

            if (circuitId) {
                const results = await fetchF1aRaceResultsByCircuit(
                    year,
                    circuitId
                );
                setRaceResults(results.race1);
                setRaceResults2(results.race2);
                setRaceResults3(results.race3);
                // console.log("setRaceResults", results);
            }

            const raceSession = sessionsData.find(
                (session) => session.session_name === "Race"
            );
            if (!raceSession) throw new Error("Race session not found");
            const sessionKey = raceSession.session_key;

            const [driverDetailsData, startingGridData, driversData] =
                await Promise.all([
                    fetch(
                        `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`
                    ).then((res) => res.json()),
                    fetch(
                        `https://api.openf1.org/v1/position?session_key=${sessionKey}`
                    ).then((res) => res.json()),
                    fetchDriversAndTires(sessionKey),
                    fetch(
                        `https://api.openf1.org/v1/laps?session_key=${sessionKey}`
                    ).then((res) => res.json()),
                ]);

            const driverDetailsMap = driverDetailsData.reduce(
                (acc, driver) => ({
                    ...acc,
                    [driver.driver_number]: driver.name_acronym,
                }),
                {}
            );

            const latestDate = startingGridData[0].date;
            const firstDifferentDate = startingGridData.find(
                (item) => item.date !== latestDate
            )?.date;
            const date = new Date(firstDifferentDate);
            date.setMinutes(date.getMinutes() - 1);

            setDrivers(driversData);

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [year, location, raceName]);

    // Sort raceResults by endPosition (ascending order)
    raceResults.sort(
        (a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)
    );
    raceResults2.sort(
        (a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)
    );
    raceResults3.sort(
        (a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)
    );

    return (
        <>
            <h1 className="heading-1 mt-[12rem] text-center">{raceName}</h1>

            <div className="pt-[6.4rem] flex flex-col md:flex-row -mb-64">
                {/* race 1 */}
                <div className="flex flex-col items-center md:w-1/2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-32">
                    <p className="heading-2 mb-32">Race 1</p>

                    <div className="bg-glow-large p-24 rounded-lg w-[25rem] mb-32">
                        {raceResults.map((result, index) => (
                            <DriverCard
                                f1a={true}
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
                                    f1a={true}
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
                                    f1a={true}
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
