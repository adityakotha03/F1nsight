import classNames from "classnames";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useParams } from "react-router-dom";

import {
    fetchDriversAndTires,
    fetchRaceResultsByCircuit,
    fetchQualifyingResultsByCircuit,
    fetchLocationData,
} from "../utils/api.js";
import { organizeQualifyingResults } from "../utils/organizeQualifyingResults.js";

import {
    DriverCard,
    Loading,
    ThreeCanvas,
    LapChart,
    TireStrategy,
    StartingGrid,
    SelectedDriverStats,
    FastestLaps,
    PositionCharts,
    ReactSelectComponent,
    Modal,
} from "../components";
import Drawer from "../components/Drawer.js";
import Accordion from "../components/Accordion.js";
import { locationMaps } from "../utils/locationMaps.js";
import { fas } from "@fortawesome/free-solid-svg-icons";

export function RacePage() {
    const { state } = useLocation();
    const { raceId } = useParams();
    const [raceName, setRaceName] = useState(state ? state.raceName : null);
    const [meetingKey, setMeetingKey] = useState(
        state ? state.meetingKey : raceId
    );
    const [year, setYear] = useState(state ? state.year : null);
    const [location, setLocation] = useState(state ? state.location : null);
    const [drivers, setDrivers] = useState([]);
    const [laps, setLaps] = useState([]);
    const [pos, setPos] = useState([]);
    const [driversDetails, setDriversDetails] = useState({});
    const [driverSelected, setDriverSelected] = useState(false);
    const [driverCode, setDriverCode] = useState("");
    const [driverNumber, setDriverNumber] = useState("");
    const [driversColor, setDriversColor] = useState({});
    const [startingGrid, setStartingGrid] = useState([]);
    const [animatedMap, setAnimatedMap] = useState("");
    const [MapPath, setMapPath] = useState("");
    const [raceResults, setRaceResults] = useState([]);
    const [locData, setLocData] = useState({});
    const [activeButtonIndex, setActiveButtonIndex] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [speedFactor, setSpeedFactor] = useState(0.2);
    const [isPaused, setIsPaused] = useState(false);
    const [haloView, setHaloView] = useState(false);
    const [topFollowView, setTopFollowView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSession, setSelectedSession] = useState("Race");
    const [selectedSessionKey, setSelectedSessionKey] = useState('');
    const [hasRaceSession, sethasRaceSession] = useState(false);
    const [hasQualifyingSession, sethasQualifyingSession] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [driverDrawerOpen, setDriverDrawerOpen] = useState(false);
    const [showStartingGrid, setShowStartingGrid] = useState(false);
    const [showCarDetails, setShowCarDetails] = useState(true);
    const [showCameraControls, setShowCameraControls] = useState(false);

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
            setIsLoading(true);
            const response = await fetch(
                `https://praneeth7781.github.io/f1nsight-api-2/races/racesbyMK.json`
            ).then((res) => res.json());
            setYear(response[raceId]["year"]);
            setLocation(response[raceId]["location"]);
            setRaceName(response[raceId]["raceName"]);
            // console.log(raceName);
        };

        if (raceName) {
        } else {
            fetchByMeetingKey();
            fetchData();
        }

        const handleResize = () => {
            setShowStartingGrid(window.innerWidth > 640 && true);
        };
        window.addEventListener("resize", handleResize);
        // Cleanup event listener on unmount
        return () => window.removeEventListener("resize", handleResize);

    }, []);

    const animatedLocations = [
        "Austin",
        "Bahrain",
        "Baku",
        "Budapest",
        "Jeddah",
        "Las Vegas",
        "Lusail",
        "Marina Bay",
        "Melbourne",
        "Mexico City",
        "Miami",
        "Monaco",
        "Monza",
        "São Paulo",
        "Sakhir",
        "Shanghai",
        "Silverstone",
        "Spa-Francorchamps",
        "Suzuka",
        "Yas Island",
        "Zandvoort",
    ];

    const selectedDriverData = drivers.find(
        (obj) => obj["acronym"] === driverCode
    );
    const selectedDriverRaceData = raceResults.find(
        (obj) => obj["number"] === driverNumber
    );

    const fetchData = async () => {
        if (!raceName) return;

        try {
            setDriverSelected(false);
            setActiveButtonIndex(null);
            setIsLoading(true);

            const circuitId = locationMaps[location];
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

            if (selectedSession === "Race") {
                setIsLoading(true);

                setMapPath(
                    `${process.env.PUBLIC_URL + "/map/" + circuitId + ".gltf"}`
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
                    const results = await fetchRaceResultsByCircuit(
                        year,
                        circuitId
                    );
                    setRaceResults(results);
                    // console.log(results);
                }

                const raceSession = sessionsData.find(
                    (session) => session.session_name === "Race"
                );
                if (!raceSession) throw new Error("Race session not found");
                const sessionKey = raceSession.session_key;
                setSelectedSessionKey(sessionKey);

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

                setPos(startingGridData);

                const driverDetailsMap = driverDetailsData.reduce(
                    (acc, driver) => ({
                        ...acc,
                        [driver.driver_number]: driver.name_acronym,
                    }),
                    {}
                );

                setDriversDetails(driverDetailsMap);

                const driverColorMap = driverDetailsData.reduce(
                    (acc, driver) => ({
                        ...acc,
                        [driver.name_acronym]: driver.team_colour,
                    }),
                    {}
                );

                setDriversColor(driverColorMap);

                const latestDate = startingGridData[0].date;
                const firstDifferentDate = startingGridData.find(
                    (item) => item.date !== latestDate
                )?.date;
                const date = new Date(firstDifferentDate);
                date.setMinutes(date.getMinutes() - 1);
                const updatedDate = date.toISOString();

                setStartTime(updatedDate);
                setEndTime(startingGridData[startingGridData.length - 1].date);

                const earliestDateTime = startingGridData[0]?.date;
                const filteredStartingGrid = startingGridData.filter(
                    (item) => item.date === earliestDateTime
                );
                setStartingGrid(filteredStartingGrid);

                setDrivers(driversData);

                setLaps(
                    lapsData.map((lap) => ({
                        ...lap,
                        driver_acronym: driverDetailsMap[lap.driver_number],
                    }))
                );

                setIsLoading(false);
            } else if (selectedSession === "Qualifying") {
                setIsLoading(true);

                setMapPath(
                    `${process.env.PUBLIC_URL + "/map/" + circuitId + ".gltf"}`
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
                    const results = await fetchQualifyingResultsByCircuit(
                        year,
                        circuitId
                    );
                    setRaceResults(results);
                    // console.log(results);
                }

                const raceSession = sessionsData.find(
                    (session) => session.session_name === "Qualifying"
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

                const driverColorMap = driverDetailsData.reduce(
                    (acc, driver) => ({
                        ...acc,
                        [driver.name_acronym]: driver.team_colour,
                    }),
                    {}
                );

                setDriversColor(driverColorMap);

                const latestDate = startingGridData[0].date;
                const firstDifferentDate = startingGridData.find(
                    (item) => item.date !== latestDate
                )?.date;
                const date = new Date(firstDifferentDate);
                date.setMinutes(date.getMinutes() - 1);
                const updatedDate = date.toISOString();

                setStartTime(updatedDate);
                setEndTime(startingGridData[startingGridData.length - 1].date);

                const earliestDateTime = startingGridData[0]?.date;
                const filteredStartingGrid = startingGridData.filter(
                    (item) => item.date === earliestDateTime
                );
                setStartingGrid(filteredStartingGrid);

                setDrivers(driversData);

                setLaps(
                    lapsData.map((lap) => ({
                        ...lap,
                        driver_acronym: driverDetailsMap[lap.driver_number],
                    }))
                );

                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [year, location, selectedSession, raceName]);

    const handleDriverSelectionClick = (index) => {
        // console.log(raceResults[index].Driver.code); // Log the driver code
        // console.log(raceResults[index].number);

        if (activeButtonIndex === index) {
            setLocData({});
            setDriverSelected(false);
            setActiveButtonIndex(null); // Reset the active button index
            setDriverCode("");
        } else {
            setLocData({});
            setDriverSelected(true);
            setDriverCode(raceResults[index].Driver.code);
            setDriverNumber(raceResults[index].number);
            setActiveButtonIndex(index); // Set new active button index

            (async () => {
                try {
                    // Fetch sessions to find the race session
                    const sessionsResponse = await fetch(
                        `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`
                    );
                    const sessionsData = await sessionsResponse.json();
                    const raceSession = sessionsData.find(
                        (session) => session.session_name === "Race"
                    );
                    if (!raceSession) throw new Error("Race session not found");
                    const sessionKey = raceSession.session_key;

                    const scaleFactor = 1500;

                    // Fetch location data using sessionKey, driverId (from state), startTime, and endTime
                    const locationData = await fetchLocationData(
                        sessionKey,
                        raceResults[index].number,
                        startTime,
                        endTime,
                        scaleFactor
                    );
                    setLocData(locationData);
                } catch (error) {
                    console.error("Error fetching location data:", error);
                }
            })();
        }
    };

    const DriverList = ({
        results,
        activeButtonIndex,
        handleDriverSelectionClick,
        drivers,
        driversColor,
        year,
        session,
    }) => {
        return (
            <ul className="w-fit mx-auto">
                {results.map((result, index) => (
                    <DriverCard
                        hasHover={false}
                        isActive={activeButtonIndex === index}
                        index={index}
                        driver={result.Driver}
                        stint={drivers}
                        driverColor={driversColor[result.Driver.code]} // Use driver code here
                        startPosition={parseInt(result.grid, 10)}
                        endPosition={parseInt(result.position, 10)}
                        year={parseInt(year)}
                        time={result[session]}
                        fastestLap={result.FastestLap}
                        layoutSmall={index > 2}
                        mobileSmall
                        isRace={false}
                    />
                ))}
            </ul>
        );
    };

    // console.log(location, MapPath);
    // console.log({raceResults});
    // console.log({startingGrid});

    const { q1Results, q2Results, q3Results } =
        organizeQualifyingResults(raceResults);

    // console.log('Q1 Results:', q1Results);
    // console.log('Q2 Results:', q2Results);
    // console.log('Q3 Results:', q3Results);

    // console.log('selectedSession', selectedSession);

    const driverSelectedShowTrack =
        (driverSelected && animatedLocations.includes(location)) ||
        !animatedLocations.includes(location);

    const driverButtons = (layoutSmall) => (
        <ul className="flex flex-col p-16">
            {raceResults.map((result, index) => (
                <button
                    key={index}
                    className="block w-full mb-2 relative"
                    onClick={() => {
                        handleDriverSelectionClick(index);
                        setModalOpen(false);
                        setIsDrawerOpen(false);
                    }}
                >
                    <DriverCard
                        hasHover
                        isActive={activeButtonIndex === index}
                        index={index}
                        driver={result.Driver}
                        stint={drivers}
                        driverColor={driversColor[driverCode]}
                        startPosition={parseInt(result.grid, 10)}
                        endPosition={parseInt(result.position, 10)}
                        year={parseInt(year)}
                        time={result.Time?.time || result.status}
                        fastestLap={result.FastestLap}
                        layoutSmall={layoutSmall}
                        // mobileSmall
                        isRace={true}
                    />
                </button>
            ))}
        </ul>
    )

    const driver1LapData = {
        driverNumber: '14',  // Driver 1's number (e.g., Piastri)
        lap: 3,             // The lap number
        sessionKey: selectedSessionKey,  // The session key of the race
        fastestLapTime: "1:39.256",
      };
      
      const driver2LapData = {
        driverNumber: '4',   // Driver 2's number (e.g., Norris)
        lap: 53,             // The lap number
        sessionKey: selectedSessionKey,  // The session key of the race
        fastestLapTime: "1:35.454",
      };

    //   console.log('selectedSessionKey:', selectedSessionKey);
    return isLoading ? (
        <Loading
            className="mt-[20rem] mb-[20rem]"
            message={`Loading ${raceName} ${year} ${selectedSession}`}
        />
    ) : (
        <div className="race-page">
            <div className="race-page__track-view relative md:pt-64">
                <div className="absolute bottom-8 w-full flex justify-between sm:justify-end items-center z-10 gap-8 px-8">
                    {driverSelected && (
                        <div className="flex items-center gap-8">
                            <button
                                className={classNames(
                                    "race-controls__play bg-glow w-32 h-32 rounded-sm",
                                    {
                                        "bg-plum-500": !isPaused,
                                    }
                                )}
                                onClick={() => setIsPaused(false)}
                            >
                                <FontAwesomeIcon icon="play" />
                            </button>
                            <button
                                className={classNames(
                                    "race-controls__pause bg-glow w-32 h-32 rounded-sm",
                                    {
                                        "bg-plum-500": isPaused,
                                    }
                                )}
                                onClick={() => setIsPaused(true)}
                            >
                                <FontAwesomeIcon icon="pause" />
                            </button>
                            <button 
                                className={classNames(
                                    "bg-glow w-32 h-32 rounded-sm",
                                    {
                                        "bg-plum-500": showCameraControls,
                                    }
                                )}
                                onClick={() => setShowCameraControls(!showCameraControls)}
                            >
                                <FontAwesomeIcon icon="camera-rotate" />
                            </button>
                            <button 
                                className={classNames(
                                    "bg-glow w-32 h-32 rounded-sm",
                                    {
                                        "bg-plum-500": showCarDetails,
                                    }
                                )}
                                onClick={() => setShowCarDetails(!showCarDetails)}
                            >
                                <FontAwesomeIcon icon="gauge" />
                            </button>
                        </div>
                        
                    )}
                    <div className="flex items-center gap-8">
                        <button 
                            className="bg-glow w-32 h-32 rounded-sm sm:hidden"
                            onClick={() => setDriverDrawerOpen(true)}
                        >
                            <FontAwesomeIcon icon="user" />
                        </button>
                        <button 
                            className="bg-glow w-32 h-32 rounded-sm"
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <FontAwesomeIcon icon="gear" />
                        </button>                        
                    </div>
                </div>

                <Drawer isOpen={driverDrawerOpen} onClose={() => setDriverDrawerOpen(false)}>
                    <div className="w-full tracking-xs text-center text-neutral-300 py-24 leading-none">
                        Select driver from the leaderboard to activate race mode
                    </div>
                    {driverButtons(true)}
                </Drawer>
                <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                    {driverSelected && (
                        <>
                        <Accordion title="Playback Speed" contentClasses="flex flex-col gap-8 items-start">
                            <button
                                className={classNames(
                                    "tracking-sm uppercase block",
                                    {
                                        "text-plum-300":
                                            speedFactor !== 4,
                                    }
                                )}
                                onClick={() => {
                                    setSpeedFactor(4)
                                    setIsDrawerOpen(false)
                                }}
                            >
                                Normal
                            </button>
                            <button
                                className={classNames(
                                    "tracking-sm uppercase block",
                                    {
                                        "text-plum-300":
                                            speedFactor !== 1.5,
                                    }
                                )}
                                onClick={() => {
                                    setSpeedFactor(1.5)
                                    setIsDrawerOpen(false)
                                }}
                            >
                                Push Push
                            </button>
                            <button
                                className={classNames(
                                    "tracking-sm uppercase block",
                                    {
                                        "text-plum-300":
                                            speedFactor !== 0.2,
                                    }
                                )}
                                onClick={() => {
                                    setSpeedFactor(0.2)
                                    setIsDrawerOpen(false)
                                }}
                            >
                                DRS
                            </button>
                        </Accordion>
                        <Accordion title="Camera Angle" contentClasses="flex flex-col gap-8 items-start">
                            <button
                                className={classNames(
                                    "tracking-sm uppercase block",
                                    {
                                        "text-plum-300": !haloView || !topFollowView,
                                    }
                                )}
                                onClick={() => {
                                    setHaloView(false)
                                    setTopFollowView(false)
                                    setIsDrawerOpen(false)
                                }}
                            >
                                Sky View
                            </button>
                            <button
                                className={classNames(
                                    "tracking-sm uppercase block",
                                    {
                                        "text-plum-300": haloView,
                                    }
                                )}
                                onClick={() => {
                                    setHaloView(true)
                                    setTopFollowView(false)
                                    setIsDrawerOpen(false)
                                }}
                            >
                                Halo View
                            </button>
                            <button
                                className={classNames(
                                    "tracking-sm uppercase block",
                                    {
                                        "text-plum-300": topFollowView,
                                    }
                                )}
                                onClick={() => {
                                    setTopFollowView(true)
                                    setIsDrawerOpen(false)
                                }}
                            >
                                Top Follow View
                            </button>
                        </Accordion>
                        </>
                    )}
                    <Accordion title="Race Selection" contentClasses="flex flex-col gap-8 items-start">
                        {hasRaceSession && (
                            <button
                                className={classNames(
                                    "tracking-sm uppercase block",
                                    {
                                        "text-plum-300": selectedSession === 'Race',
                                    }
                                )}
                                onClick={() => {
                                    setSelectedSession("Race")
                                    setIsDrawerOpen(false)
                                }}
                            >
                                Race
                            </button>
                        )}
                        {hasQualifyingSession && (
                            <button
                                className={classNames(
                                    "tracking-sm uppercase block",
                                    {
                                        "text-plum-300": selectedSession === 'Qualifying',
                                    }
                                )}
                                onClick={() => {
                                    setSelectedSession("Qualifying")
                                    setIsDrawerOpen(false)
                                }}
                            >
                                Qualifying
                            </button>
                        )}
                    </Accordion>
                </Drawer>

                {selectedSession === "Race" && (
                    <>
                    <div className="bg-glow-dark text-center py-8 max-sm:hidden">Select a driver from the leaderboard to activate telemetry viewer</div>
                    <div className="race-page__track-view__display relative">
                        {driverSelectedShowTrack ? (
                            <ThreeCanvas
                                className="race-page__track-view__display__canvas"
                                MapFile={MapPath}
                                locData={locData}
                                driverSelected={driverSelected}
                                constructorId={selectedDriverRaceData ? selectedDriverRaceData.Constructor.constructorId : ""}
                                driverCode={driverCode}
                                driverColor={driversColor[driverCode]}
                                isPaused={isPaused}
                                haloView={haloView}
                                topFollowView={topFollowView}
                                speedFactor={speedFactor}
                                year={year}
                                showCarDetails={showCarDetails}
                                showCameraControls={showCameraControls}
                            />
                        ) : (
                            <div className="race-page__track-view__display__preview">
                                <video
                                    src={animatedMap}
                                    loop
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="max-sm:hidden absolute top-[0] left-[0]">
                            {driverButtons(true)}
                        </div>
                    </div>
                    </>
                )}
            </div>
            {/* End .race-page__track-view */}

            <div className="race-page__scroll-container">
                {selectedSession === "Qualifying" && (
                    <button className="text-xs tracking-xs uppercase mb-16 bg-glow rounded-sm p-4 ml-8" onClick={() => setSelectedSession("Race")}>
                        <FontAwesomeIcon icon="chevron-left" className="mr-16" />
                        race
                    </button>
                )}

                <div className="mb-40 flex flex-col gap-4 items-center uppercase">
                    <p className="text-sm tracking-sm">{year}</p> 
                    <h1 className="heading-3">{raceName}</h1> 
                    {selectedSession === "Qualifying" && <p className="text-sm tracking-sm">{selectedSession}</p>}
                    <div className="divider-glow-dark mt-32" />
                </div>

                {/* Qualifying View */}
                {selectedSession !== "Race" && (
                    <div className="flex items-start justify-center gap-8 sm:gap-32 mx-8 mb-32">
                        <div className="p-16 bg-glow-dark rounded-md sm:rounded-xlarge max-md:w-full">
                            <h3 className="heading-3 mb-32 gradient-text-light">
                                Q1
                            </h3>
                            <DriverList
                                results={q1Results}
                                activeButtonIndex={activeButtonIndex}
                                handleDriverSelectionClick={
                                    handleDriverSelectionClick
                                }
                                drivers={drivers}
                                driversColor={driversColor}
                                year={year}
                                session="Q1"
                            />
                        </div>
                        <div className="p-16 bg-glow-dark rounded-md sm:rounded-xlarge max-md:w-full">
                            <h3 className="heading-3 mb-32 gradient-text-light">
                                Q2
                            </h3>
                            <DriverList
                                results={q2Results}
                                activeButtonIndex={activeButtonIndex}
                                handleDriverSelectionClick={
                                    handleDriverSelectionClick
                                }
                                drivers={drivers}
                                driversColor={driversColor}
                                year={year}
                                session="Q2"
                            />
                        </div>
                        <div className="p-16 bg-glow-dark rounded-md sm:rounded-xlarge max-md:w-full">
                            <h3 className="heading-3 mb-32 gradient-text-light">
                                Q3
                            </h3>
                            <DriverList
                                results={q3Results}
                                activeButtonIndex={activeButtonIndex}
                                handleDriverSelectionClick={
                                    handleDriverSelectionClick
                                }
                                drivers={drivers}
                                driversColor={driversColor}
                                year={year}
                                session="Q3"
                            />
                        </div>
                    </div>
                )}

                {/* Raace View */}
                <div className="page-container-centered flex flex-col justify-center sm:flex-row gap-16 mt-32">
                    {selectedSession === "Race" && (
                        <div className="sm:w-[26rem]">
                            {driverSelected && (
                                <SelectedDriverStats
                                    selectedDriverData={selectedDriverData}
                                    selectedDriverRaceData={
                                        selectedDriverRaceData
                                    }
                                    year={year}
                                />
                            )}
                            <div 
                                className={classNames(
                                    "flex flex-row justify-between gap-4 max-sm:mb-16",
                                )}
                            >
                                <button 
                                    className={classNames(
                                        "text-neutral-400 font-display sm:ml-24 sm:text-xl sm:mb-16 leading-none", 
                                        showStartingGrid && "max-sm:text-white"
                                    )} 
                                    onClick={() => setShowStartingGrid(true)}
                                >
                                    Starting Grid
                                </button>
                                <button 
                                    className={classNames("text-neutral-400 font-display sm:hidden", !showStartingGrid && "text-white")}
                                    onClick={() => setShowStartingGrid(false)}
                                >
                                    Race Results
                                </button>
                            </div>
                            <div className={classNames("flex flex-row items-start gap-4 sm:hidden mb-24")}>
                                <StartingGrid
                                    className={classNames("transition-all overflow-hidden", showStartingGrid ? "w-2/3" : "w-1/3 opacity-15")}
                                    raceResults={raceResults}
                                    startingGrid={startingGrid}
                                    year={year}
                                    driverCode={driverCode}
                                    driversDetails={driversDetails}
                                    driversColor={driversColor}
                                />
                                <div 
                                    className={classNames(
                                        "bg-glow-large h-fit rounded-md sm:rounded-xlarge transition-all overflow-hidden",
                                        showStartingGrid ? "w-1/3 opacity-15" : "w-2/3"
                                    )}>
                                    {driverButtons(false)}
                                </div>
                            </div>
                            <StartingGrid
                                className={classNames("max-sm:hidden w-[26rem]")}
                                raceResults={raceResults}
                                startingGrid={startingGrid}
                                year={year}
                                driverCode={driverCode}
                                driversDetails={driversDetails}
                                driversColor={driversColor}
                            />
                        </div>
                    )}

                    <div className="sm:grow">
                        {selectedSession === "Race" && (
                            <PositionCharts
                                laps={laps}
                                pos={pos}
                                startGrid={startingGrid}
                                driversDetails={driversDetails}
                                driversColor={driversColor}
                                raceResults={raceResults}
                                driverCode={
                                    driverSelected
                                        ? driversDetails[driverNumber]
                                        : null
                                }
                            />
                        )}
                        <LapChart
                            laps={laps}
                            setLaps={() => setLaps}
                            driversDetails={driversDetails}
                            driversColor={driversColor}
                            raceResults={raceResults}
                            className="lap-chart"
                            driverCode={
                                driverSelected
                                    ? driversDetails[driverNumber]
                                    : null
                            }
                        />
                        <TireStrategy
                            drivers={drivers}
                            raceResults={raceResults}
                            driverCode={
                                driverSelected
                                    ? driversDetails[driverNumber]
                                    : null
                            }
                            driverColor={driversColor[driverCode]}
                        />
                        {!driverSelected && selectedSession === "Race" && (
                            <FastestLaps
                                raceResults={raceResults}
                                drivers={drivers}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
