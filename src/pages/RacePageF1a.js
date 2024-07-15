import classNames from "classnames";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useParams } from "react-router-dom";
import {
    fetchDriversAndTires,
    fetchF1aRaceResultsByCircuit,
    fetchQualifyingResultsByCircuit,
    fetchLocationData,
} from "../utils/api.js";

import {
    DriverCard,
    Loading,
    Select,
    ThreeCanvas,
    LapChart,
    TireStrategy,
    StartingGridF1A,
    SelectedDriverStats,
    FastestLapsF1A,
} from "../components";

export function RacePageF1a() {
    const { state } = useLocation();
    const { raceId } = useParams();
    const [raceName, setRaceName] = useState(state? state.raceName : null);
    const [meetingKey, setMeetingKey] = useState(state ? state.meetingKey : raceId);
    const [year, setYear] = useState(state ? state.year : null);
    const [location, setLocation] = useState(state ? state.location : null);
    const [drivers, setDrivers] = useState([]);
    const [laps, setLaps] = useState([]);
    const [driversDetails, setDriversDetails] = useState({});
    const [driverSelected, setDriverSelected] = useState(false);
    const [driverCode, setDriverCode] = useState("");
    const [driverNumber, setDriverNumber] = useState("");
    const [driversColor, setDriversColor] = useState({});
    const [startingGrid, setStartingGrid] = useState([]);
    const [animatedMap, setAnimatedMap] = useState("");
    const [MapPath, setMapPath] = useState("");
    const [raceResults, setRaceResults] = useState([]);
    const [raceResults2, setRaceResults2] = useState([]);
    const [locData, setLocData] = useState({});
    const [activeButtonIndex, setActiveButtonIndex] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [speedFactor, setSpeedFactor] = useState(0.2);
    const [isPaused, setIsPaused] = useState(false);
    const [haloView, setHaloView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSession, setSelectedSession] = useState("Race");
    const [hasRaceSession, sethasRaceSession] = useState(false);
    const [hasQualifyingSession, sethasQualifyingSession] = useState(false);

    useEffect(() => {
        const setBaseData = async () => {
            setRaceName(state.raceName);
            setYear(state.year);
            setLocation(state.location);
            setMeetingKey(state.meetingKey);
        }
        if(state) setBaseData();
    }, [state])

    useEffect(() => {
        const fetchByMeetingKey = async() => {
            const response = await fetch(`https://ant-dot-comm.github.io/f1aapi/races/racesbyMK.json`).then((res) => res.json());
            setYear(response[raceId]["year"]);
            setLocation(response[raceId]["location"]);
            setRaceName(response[raceId]["raceName"]);
            // console.log('fetchByMeetingKey', response[raceId]);
        };
        if(raceName){}
        else{
            fetchByMeetingKey();
        }
    },[]) 

    // console.log(raceName, year, location, meetingKey);

    const fetchData = async () => {
        if (!raceName) return;

        try {
            setDriverSelected(false);
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
                Lusail: "losail",
                "Yas Island": "yas_marina",
            };

            setIsLoading(true);

            const circuitId = locationMap[location];
            // console.log('circuitId', circuitId);
            const sessionsResponse = await fetch(
                `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`
            );
            const sessionsData = await sessionsResponse.json();

            const hasRaceSession = sessionsData.some(
                (session) => session.session_name === "Race"
            );
            sethasRaceSession(hasRaceSession);
            const hasQualifyingSession = sessionsData.some(
                (session) => session.session_name === "Qualifying"
            );
            sethasQualifyingSession(hasQualifyingSession);

            setIsLoading(true);

            setMapPath(
                `${
                    process.env.PUBLIC_URL +
                    "/map/" +
                    circuitId +
                    ".gltf"
                }`
            );

            setAnimatedMap(
                `${
                    process.env.PUBLIC_URL +
                    "/mapsAnimated/" +
                    circuitId +
                    "Animated.mp4"
                }`
            );

            if (circuitId) {
                const results = await fetchF1aRaceResultsByCircuit(
                    year,
                    circuitId
                );
                setRaceResults(results.Results.race1);
                setRaceResults2(results.Results.race2);
                // console.log('setRaceResults', results.Results);
            }

            const raceSession = sessionsData.find(
                (session) => session.session_name === "Race"
            );
            if (!raceSession) throw new Error("Race session not found");
            const sessionKey = raceSession.session_key;

            const [
                driverDetailsData,
                startingGridData,
                driversData,
                lapsData,
            ] = await Promise.all([
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

            setDriversDetails(driverDetailsMap);

            const latestDate = startingGridData[0].date;
            const firstDifferentDate = startingGridData.find(
                (item) => item.date !== latestDate
            )?.date;
            const date = new Date(firstDifferentDate);
            date.setMinutes(date.getMinutes() - 1);
            const updatedDate = date.toISOString();

            setStartTime(updatedDate);
            setEndTime(
                startingGridData[startingGridData.length - 1].date
            );

            // const earliestDateTime = startingGridData[0]?.date;
            // const filteredStartingGrid = startingGridData.filter(
            //     (item) => item.date === earliestDateTime
            // );
            // setStartingGrid(filteredStartingGrid);

            setDrivers(driversData);

            setLaps(
                lapsData.map((lap) => ({
                    ...lap,
                    driver_acronym: driverDetailsMap[lap.driver_number],
                }))
            );

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [year, location, selectedSession, raceName]);

    return (
        <div className="pt-[10rem] flex flex-col md:flex-row">


            {/* race 1 */}
            <div className="flex flex-col items-center md:w-1/2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-32">
                
                <p className="heading-2 mb-32">Race 1</p>

                <div className="w-[20rem] mb-32">
                    {raceResults.map((result, index) => (
                        <DriverCard
                            f1a={true}
                            hasHover
                            isActive={activeButtonIndex === index}
                            index={index}
                            driver={result.Driver}
                            stint={drivers}
                            driverColor={driversColor[driverCode]}
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

                <StartingGridF1A
                    raceResults={raceResults}
                />

                <div className="page-container-centered">
                    <FastestLapsF1A
                        raceResults={raceResults}
                        drivers={drivers}
                    />
                </div>
            </div>
            
            {/* Race 2 */}
            <div className="flex flex-col items-center md:w-1/2 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 p-32">

                <p className="heading-2 mb-32">Race 2</p>

                <div className="w-[20rem] mb-32">
                    {raceResults2.map((result, index) => (
                        <DriverCard
                            f1a={true}
                            hasHover
                            isActive={activeButtonIndex === index}
                            index={index}
                            driver={result.Driver}
                            stint={drivers}
                            driverColor={driversColor[driverCode]}
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

                <StartingGridF1A
                    raceResults={raceResults2}
                />

                <div className="page-container-centered">
                    <FastestLapsF1A
                        raceResults={raceResults2}
                        drivers={drivers}
                    />
                </div>
            </div>
        </div>
    );
}
