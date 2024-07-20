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

import {
    DriverCard,
    Loading,
    Select,
    ThreeCanvas,
    LapChart,
    TireStrategy,
    StartingGrid,
    SelectedDriverStats,
    FastestLaps,
} from "../components";

export function RacePage() {
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
            setIsLoading(true);
            const response = await fetch(`https://praneeth7781.github.io/f1nsight-api-2/races/racesbyMK.json`).then((res) => res.json());
            setYear(response[raceId]["year"]);
            setLocation(response[raceId]["location"]);
            setRaceName(response[raceId]["raceName"]);
            console.log(raceName);
        };
        if(raceName){}
        else{
            fetchByMeetingKey();
            fetchData();
        }
    },[])

    const handleOptionChange = (event) => {
        setSelectedSession(event.target.value);
    };


    const animatedLocations = ["Sakhir", "Suzuka", "Melbourne", "Monaco", "Silverstone", "Budapest"];

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
                setEndTime(
                    startingGridData[startingGridData.length - 1].date
                );

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
                setEndTime(
                    startingGridData[startingGridData.length - 1].date
                );

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

    // console.log(location, MapPath);

    return isLoading ? (
        <Loading
            className="mt-[20rem] mb-[20rem]"
            message={`Loading ${raceName} ${year} ${selectedSession}`}
        />
    ) : (
        <div className="pt-[10rem]">
            <div className="flex flex-col items-center justify-center mb-32">
                {raceName && (
                    <p className="heading-2 text-center text-neutral-400 mb-8">
                        {raceName} {year}
                    </p>
                )}
                <Select
                    className="w-fit"
                    label="Select Session"
                    onChange={handleOptionChange}
                    value={selectedSession}
                >
                    {hasRaceSession && <option value="Race">Race</option>}
                    {hasQualifyingSession && (
                        <option value="Qualifying">Qualifying</option>
                    )}
                </Select>
            </div>

            {selectedSession === "Race" && (
                <>
                    {!driverSelected && (
                        <div className="w-full tracking-xs text-center text-neutral-300 gradient-border-extreme py-8 px-32 leading-none">
                            Select driver from the leaderboard to activate race
                            mode
                        </div>
                    )}
                    <div className="race-display mb-64 relative">
                        <ul className="flex flex-col absolute top-1 left-1 z-10">
                            {raceResults.map((result, index) => (
                                <button
                                    key={index}
                                    className="block w-full mb-2 relative "
                                    onClick={() =>
                                        handleDriverSelectionClick(index)
                                    }
                                >
                                    <DriverCard
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
                                        year={parseInt(year)}
                                        time={
                                            result.Time?.time || result.status
                                        }
                                        fastestLap={result.FastestLap}
                                        layoutSmall={index > 2}
                                        mobileSmall
                                    />
                                </button>
                            ))}
                        </ul>
                        {(driverSelected &&
                            animatedLocations.includes(location)) ||
                        !animatedLocations.includes(location) ? (
                            <ThreeCanvas
                                MapFile={MapPath}
                                locData={locData}
                                driverSelected={driverSelected}
                                driverCode={driverCode}
                                driverColor={driversColor[driverCode]}
                                isPaused={isPaused}
                                haloView={haloView}
                                controls={
                                    <div className="relative z-10">
                                        {driverSelected && (
                                            <div className="race-controls">
                                                <button
                                                    className="race-controls__play gradient-border-extreme py-16 px-32"
                                                    onClick={() =>
                                                        setIsPaused(false)
                                                    }
                                                >
                                                    <FontAwesomeIcon icon="play" />
                                                </button>
                                                <button
                                                    className="race-controls__pause gradient-border-extreme py-16 px-32"
                                                    onClick={() =>
                                                        setIsPaused(true)
                                                    }
                                                >
                                                    <FontAwesomeIcon icon="pause" />
                                                </button>
                                                <button
                                                    className="race-controls__view gradient-border-extreme py-16 px-32 tracking-sm uppercase text-xs"
                                                    onClick={() =>
                                                        setHaloView(!haloView)
                                                    }
                                                >
                                                    {haloView
                                                        ? "Sky View"
                                                        : "Halo View"}
                                                </button>
                                                <div className="race-controls__speed gradient-border-extreme flex text-xs max-sm:flex-col sm:items-center sm:justify-center gap-16 py-16 px-32 tracking-sm uppercase text-center">
                                                    <p>Playback Speed:</p>
                                                    <button
                                                        className={classNames(
                                                            "tracking-sm uppercase",
                                                            {
                                                                "text-neutral-400":
                                                                    speedFactor !==
                                                                    4,
                                                            }
                                                        )}
                                                        onClick={() =>
                                                            setSpeedFactor(4)
                                                        }
                                                    >
                                                        Normal
                                                    </button>
                                                    <button
                                                        className={classNames(
                                                            "tracking-sm uppercase",
                                                            {
                                                                "text-neutral-400":
                                                                    speedFactor !==
                                                                    1.5,
                                                            }
                                                        )}
                                                        onClick={() =>
                                                            setSpeedFactor(1.5)
                                                        }
                                                    >
                                                        Push Push
                                                    </button>
                                                    <button
                                                        className={classNames(
                                                            "tracking-sm uppercase",
                                                            {
                                                                "text-neutral-400":
                                                                    speedFactor !==
                                                                    0.2,
                                                            }
                                                        )}
                                                        onClick={() =>
                                                            setSpeedFactor(0.2)
                                                        }
                                                    >
                                                        DRS
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                                speedFactor={speedFactor}
                            />
                        ) : (
                            <div className="track-preview">
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
                    </div>
                </>
            )}

            <div className="page-container-centered flex flex-col justify-center sm:flex-row gap-16 mt-32">
                {selectedSession === "Race" && (
                    <div className="sm:w-[26rem]">
                        {driverSelected && (
                            <SelectedDriverStats
                                selectedDriverData={selectedDriverData}
                                selectedDriverRaceData={selectedDriverRaceData}
                                year={year}
                            />
                        )}
                        <StartingGrid
                            raceResults={raceResults}
                            startingGrid={startingGrid}
                            year={year}
                            driverCode={driverCode}
                            driversDetails={driversDetails}
                            driversColor={driversColor}
                        />
                    </div>
                )}

                <div className="sm:grow-0">
                    <LapChart
                        laps={laps}
                        setLaps={() => setLaps}
                        driversDetails={driversDetails}
                        driversColor={driversColor}
                        raceResults={raceResults}
                        className="lap-chart"
                        driverCode={
                            driverSelected ? driversDetails[driverNumber] : null
                        }
                    />
                    <TireStrategy
                        drivers={drivers}
                        raceResults={raceResults}
                        driverCode={
                            driverSelected ? driversDetails[driverNumber] : null
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
    );
}
