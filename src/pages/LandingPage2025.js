import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { useInView } from "framer-motion";
import classNames from "classnames";

import { Button, RaceResultItem, DriverCard } from "../components";
import { trackButtonClick } from "../utils/gaTracking";
import { fetchMostRecentRace } from "../utils/api";
import { fetchMostRecentRaceWeekendF1a } from "../utils/apiF1a";
import PngSequencePlayer from "../components/PngSequencePlayer";
import HeroSection from "../layouts/HeroSection";
import ComparisonsSection from "../layouts/ComparisonsSection";
import ArSection from "../layouts/ArSection";

export function LandingPage2025({ setResultPagePath }) {
    const [raceData, setRaceData] = useState(null);
    const [F1aRaceData, setF1aRaceData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2024);
    const [layoutSmall, setLayoutSmall] = useState();
    const [layoutMobile, setLayoutMobile] = useState();
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
            setLayoutMobile(window.innerWidth < 768);
        };
        handleLayout();

        window.addEventListener("resize", handleLayout);
        return () => window.removeEventListener("resize", handleLayout);
    }, []);

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

                    <div className="bg-neutral-950/40 absolute w-full h-full rounded-md overflow-hidden">
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
                            className="object-cover opacity-15 h-full w-full"
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
                <div className="bg-gradient-to-b from-neutral-950/50 to-neutral-950/5 rounded-md w-full py-32 flex flex-col items-center relative">
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
            <HeroSection layoutMobile={layoutMobile} />

            <section className="flex flex-col md:flex-row items-stretch">
                <div className="px-16 py-48 w-full md:w-1/2 bg-gradient-to-b from-neutral-950 to-neutral-950/10">
                    {latestResultsLayout()}
                </div>
                <div className="px-16 py-48 w-full md:w-1/2 bg-gradient-to-b from-neutral-950 to-neutral-700/10">
                    {latestF1aResultsLayout()}
                </div>
            </section>

            <ComparisonsSection layoutMobile={layoutMobile} />
            <ArSection layoutMobile={layoutMobile} />

            <section className="py-64 bg-gradient-to-b from-neutral-950/30 to-neutral-950/5">
                <div className="max-w-screen-lg flex flex-col sm:flex-row items-center mx-auto gap-16">
                    <img
                        className="w-1/2"
                        src={`${
                            process.env.PUBLIC_URL + "/images/testTelemetry.png"
                        }`}
                        alt="AR Car"
                    />
                    <div className="w-full sm:w-2/3 flex flex-col gap-16">
                        <div>
                            <h2 className="heading-3">
                                Interactive Telemetry{" "}
                            </h2>
                            <p>Select a Driver</p>
                            <p>Monitor their race progress lap by lap.</p>
                            <p>Multiple Camera Views</p>
                            <p>
                                Get closer to the action with various
                                perspectives.
                            </p>
                            <p>Detailed Telemetry Data</p>
                            <p>Analyze every aspect of driver performance.</p>
                        </div>
                        <Button
                            as="button"
                            onClick={() => navigateToRaceResult(raceData)}
                            size="sm"
                            className="shadow-xl w-fit"
                        >
                            View Latest F1 Race
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
