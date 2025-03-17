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
import TelemetrySection from "../layouts/TelemetrySection";

export function LandingPage2025({ setResultPagePath }) {
    const [raceData, setRaceData] = useState(null);
    const [F1aRaceData, setF1aRaceData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [layoutSmall, setLayoutSmall] = useState();
    const [layoutMobile, setLayoutMobile] = useState();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        const fetchData = async () => {
            const mostRecentRace = await fetchMostRecentRace(2025);
            const mostRecentF1aRaceWeekend =
                await fetchMostRecentRaceWeekendF1a(2024);
            setRaceData(mostRecentRace);
            setF1aRaceData(mostRecentF1aRaceWeekend);
            // console.log({ mostRecentRace });
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
                        <p className="text-sm tracking-xs uppercase gradient-text-light">
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
                                        year={selectedYear}
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

                <div className="flex flex-row items-center gap-32 md:gap-64 md:px-32 w-full ">
                    <button
                        onClick={() => navigate("/driver-standings")}
                        className="w-full hover:scale-105 transition-all"
                    >
                        <img
                            src={`${
                                process.env.PUBLIC_URL + "/images/driversf1.png"
                            }`}
                            alt="formula 1 drivers championship"
                            className=""
                        />
                    </button>
                    <button
                        onClick={() => navigate("/constructor-standings")}
                        className="w-full hover:scale-105 transition-all"
                    >
                        <img
                            src={`${
                                process.env.PUBLIC_URL +
                                "/images/constructorf1.png"
                            }`}
                            alt="formula 1 constructor championship"
                            className=""
                        />
                    </button>
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
                        <p className="text-sm tracking-xs uppercase gradient-text-light">
                            Latest F1A Race Results
                        </p>
                        <p className="font-display text-xl">
                            2024 {F1aRaceData?.raceName}
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
                                                year={2024} // back to selectedYear once season start
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
                                                year={2024} // back to selectedYear once season start
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

                <div className="flex flex-row items-center gap-32 md:gap-64 md:px-32 w-full ">
                    <button
                        onClick={() => navigate("/f1a/driver-standings")}
                        className="w-full hover:scale-105 transition-all"
                    >
                        <img
                            src={`${
                                process.env.PUBLIC_URL +
                                "/images/driversf1a.png"
                            }`}
                            alt="formula 1 academy drivers championship"
                            className=""
                        />
                    </button>
                    <button
                        onClick={() => navigate("/f1a/constructor-standings")}
                        className="w-full hover:scale-105 transition-all"
                    >
                        <img
                            src={`${
                                process.env.PUBLIC_URL +
                                "/images/constructorf1a.png"
                            }`}
                            alt="formula 1 academy constructors championship"
                            className=""
                        />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div>
            <HeroSection layoutMobile={layoutMobile} />

            <section className="flex flex-col md:flex-row items-stretch">
                <div className="px-16 py-48 w-full md:w-1/2 bg-gradient-to-b from-neutral-950 to-plum-500">
                    {latestResultsLayout()}
                </div>
                <div className="px-16 py-48 w-full md:w-1/2 bg-gradient-to-b from-neutral-950 to-fuchsia-800">
                    {latestF1aResultsLayout()}
                </div>
            </section>

            <ComparisonsSection layoutMobile={layoutMobile} />
            <ArSection layoutMobile={layoutMobile} />
            <TelemetrySection
                layoutMobile={layoutMobile}
                onClick={() => navigateToRaceResult(raceData)}
            />
        </div>
    );
}
