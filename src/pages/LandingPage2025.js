import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { useInView } from "framer-motion";
import classNames from "classnames";

import { Button, RaceResultItem, DriverCard } from "../components";
import { trackButtonClick } from "../utils/gaTracking";
import { fetchMostRecentRace } from "../utils/api";
import { fetchMostRecentRaceWeekendF1a } from "../utils/apiF1a";

export function LandingPage2025({ setResultPagePath }) {
    const [raceData, setRaceData] = useState(null);
    const [F1aRaceData, setF1aRaceData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2024);
    const [layoutSmall, setLayoutSmall] = useState(2024);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        const fetchData = async () => {
            const mostRecentRace = await fetchMostRecentRace(selectedYear);
            const mostRecentF1aRaceWeekend =
                await fetchMostRecentRaceWeekendF1a(selectedYear);
            setRaceData(mostRecentRace);
            setF1aRaceData(mostRecentF1aRaceWeekend);
            console.log({ mostRecentRace });
            // console.log({mostRecentF1aRaceWeekend});
            // setIsLoading(false);
        };

        fetchData();

        const handleLayout = () => {
            setLayoutSmall(window.innerWidth > 767 && window.innerWidth < 1024);
        };
        handleLayout();

        window.addEventListener("resize", handleLayout);
        return () => window.removeEventListener("resize", handleLayout);
    }, []);

    useEffect(() => {}, []);

    let navigate = useNavigate();
    const navigateToRaceResult = (race) => {
        if (race?.meetingKey) {
            navigate(`/race/${race.meetingKey}`);
        } else {
            console.error("Meeting key not found for this race.");
        }
    };
    const navigateToF1aRaceResult = (race) => {
        if (race?.season && race?.round) {
            navigate(`/race-f1a/${race.season}${race.round}`);
        } else {
            console.error("Meeting key not found for this race.");
        }
    };

    // const circuitId = locationMap[location];

    const latestResultsLayout = () => {
        return (
            <div className="flex flex-col items-center gap-16">
                <div className="relative w-full flex flex-col items-center mb-32">
                    <div className="flex flex-col items-center z-10 pt-32">
                        <p className="text-sm tracking-xs uppercase">
                            Latest F1 Race Results
                        </p>
                        <p className="font-display text-xl">
                            {selectedYear} {raceData?.raceName}
                        </p>
                        <ul className="race-results__list mt-32">
                            {raceData?.raceResults.map(
                                (result, resultIndex) => (
                                    <RaceResultItem
                                        className={`race-results__list__item-${
                                            resultIndex + 1
                                        }`}
                                        carNumber={result.number}
                                        driver={result.driver}
                                        fastestLap={result.fastestLap}
                                        startPosition={parseInt(
                                            result.grid,
                                            10
                                        )}
                                        key={resultIndex}
                                        index={resultIndex}
                                        endPosition={parseInt(
                                            result.position,
                                            10
                                        )}
                                        status={result.status}
                                        time={result.time}
                                        year={2024}
                                        // wireframe={race.results.length === 0}
                                    />
                                )
                            )}
                        </ul>
                        <div className="divider-glow-dark mb-32" />
                    </div>

                    <div className="bg-neutral-900/50 absolute w-full h-full rounded-md overflow-hidden">
                        <video
                            src={
                                raceData &&
                                raceData.Circuit &&
                                raceData.Circuit.circuitId
                                    ? `${
                                          process.env.PUBLIC_URL +
                                          "/mapsAnimated/" +
                                          raceData.Circuit.circuitId +
                                          "Animated.mp4"
                                      }`
                                    : ""
                            }
                            loop
                            autoPlay
                            muted
                            playsInline
                            className="object-cover opacity-15"
                        />
                    </div>
                    <div className="divider-glow-dark absolute bottom-[-16px] !w-[95%]" />
                    <Button
                        as="button"
                        onClick={() => navigateToRaceResult(raceData)}
                        className="-mb-24"
                        size="md"
                    >
                        View Full Results
                    </Button>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
                    <Button
                        as="button"
                        onClick={() => navigate("/driver-standings")}
                        size="sm"
                        buttonStyle="hollow"
                        className="w-full"
                    >
                        Driver Standings
                    </Button>
                    <Button
                        as="button"
                        onClick={() => navigate("/constructor-standings")}
                        size="sm"
                        buttonStyle="hollow"
                        className="w-full"
                    >
                        Constructor Standings
                    </Button>
                </div>
            </div>
        );
    };

    const f1aWrapperClasses = "";
    const f1aListClasses = "flex flex-col gap-4";
    const f1aH3Classes = " text-sm tracking-xs uppercase";

    const latestF1aResultsLayout = () => {
        return (
            <div className="flex flex-col items-center gap-16 ">
                <div className="bg-gradient-to-b from-neutral-950/30 to-neutral-950/5 rounded-md w-full py-32 flex flex-col items-center relative">
                    <div className="text-center">
                        <p className="text-sm tracking-xs uppercase">
                            Latest F1A Race Results
                        </p>
                        <p className="font-display text-xl">
                            {F1aRaceData?.raceName}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 items-center py-[26px]">
                        {F1aRaceData?.race1?.length > 0 && (
                            <div className={f1aWrapperClasses}>
                                <h3 className={f1aH3Classes}>Race 1</h3>
                                <ul className={f1aListClasses}>
                                    {F1aRaceData?.race1.map(
                                        (result, resultIndex) => (
                                            <DriverCard
                                                f1a={true}
                                                index={resultIndex}
                                                driver={result.Driver}
                                                startPosition={parseInt(
                                                    result.grid,
                                                    10
                                                )}
                                                endPosition={parseInt(
                                                    result.position,
                                                    10
                                                )}
                                                year={selectedYear}
                                                time={
                                                    result.Time?.time ||
                                                    result.status
                                                }
                                                fastestLap={result.FastestLap}
                                                layoutSmall={layoutSmall}
                                            />
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                        {F1aRaceData?.race2?.length > 0 && (
                            <div className={f1aWrapperClasses}>
                                <h3 className={f1aH3Classes}>Race 2</h3>
                                <ul className={f1aListClasses}>
                                    {F1aRaceData?.race2.map(
                                        (result, resultIndex) => (
                                            <DriverCard
                                                f1a={true}
                                                index={resultIndex}
                                                driver={result.Driver}
                                                startPosition={parseInt(
                                                    result.grid,
                                                    10
                                                )}
                                                endPosition={parseInt(
                                                    result.position,
                                                    10
                                                )}
                                                year={selectedYear}
                                                time={
                                                    result.Time?.time ||
                                                    result.status
                                                }
                                                fastestLap={result.FastestLap}
                                                layoutSmall={layoutSmall}
                                            />
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="divider-glow-dark absolute bottom-[-16px] !w-[95%]" />
                </div>
                <Button
                    as="button"
                    onClick={() => navigateToF1aRaceResult(F1aRaceData)}
                    size="md"
                    className="-mt-48"
                >
                    View Full Results
                </Button>

                <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
                    <Button
                        as="button"
                        onClick={() => navigate("/f1a/driver-standings")}
                        size="sm"
                        buttonStyle="hollow"
                        className="w-full"
                    >
                        Driver Standings
                    </Button>
                    <Button
                        as="button"
                        onClick={() => navigate("/f1a/constructor-standings")}
                        size="sm"
                        buttonStyle="hollow"
                        className="w-full"
                    >
                        Constructor Standings
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div>
            <section className="bg-black relative">
                <video
                    className=""
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ opacity: 0.15 }}
                >
                    <source
                        src={`${process.env.PUBLIC_URL + "/Media/Hero.mp4"}`}
                        type="video/mp4"
                    />
                </video>
                <h1 className="heading-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-2/3">
                    Your Ultimate Destination for F1 Data and Analysis
                </h1>
            </section>
            <section className="flex flex-col md:flex-row items-stretch">
                <div className="px-16 py-32 w-full md:w-1/2 bg-gradient-to-b from-neutral-950 to-plum-500">
                    {latestResultsLayout()}
                </div>
                <div className="px-16 py-32 w-full md:w-1/2 bg-gradient-to-b from-neutral-950 to-fuchsia-500">
                    {latestF1aResultsLayout()}
                </div>
            </section>
        </div>
    );
}
