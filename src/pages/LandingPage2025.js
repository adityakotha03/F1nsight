import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import classNames from "classnames";

import { Button, RaceResultItem, DriverCard } from "../components";
import { trackButtonClick } from "../utils/gaTracking";
import { fetchMostRecentRace } from "../utils/api";
import { fetchMostRecentRaceWeekend } from "../utils/apiF1a";
import PngSequencePlayer from "../components/PngSequencePlayer";
import {  ReactComponent as F1ALogo} from '../components/F1Ansight.svg';
import {  ReactComponent as F2Logo} from '../components/F2nsight.svg';
import HeroSection from "../layouts/HeroSection";
import ComparisonsSection from "../layouts/ComparisonsSection";
import ArSection from "../layouts/ArSection";
import TelemetrySection from "../layouts/TelemetrySection";

export function LandingPage2025({ setResultPagePath }) {
    const [raceData, setRaceData] = useState(null);
    const [F1aRaceData, setF1aRaceData] = useState(null);
    const [F2RaceData, setF2RaceData] = useState(true);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [layoutSmall, setLayoutSmall] = useState();
    const [layoutMobile, setLayoutMobile] = useState();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });   
     // Get scroll progress for smooth parallax effect
     const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const yDecoration2 = useTransform(scrollYProgress, [0, 1], [150, -50]); // Decorations move the most

    useEffect(() => {
        const fetchData = async () => {
            const mostRecentRace = await fetchMostRecentRace(2025);
            const mostRecentF1aRaceWeekend =
                await fetchMostRecentRaceWeekend(2025, "F1A");
            const mostRecentF2RaceWeekend =
                await fetchMostRecentRaceWeekend(2025, "F2");
            setRaceData(mostRecentRace);
            setF1aRaceData(mostRecentF1aRaceWeekend);
            setF2RaceData(mostRecentF2RaceWeekend);
            // console.log('mostRecentF2RaceWeekend', {mostRecentF2RaceWeekend});
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
            trackButtonClick(`Home/Click/F1/View Full Results - ${`/race/${race.meetingKey}`}`);
        } else {
            console.error("Meeting key not found for this race.");
        }
    };
    const navigateToF1aRaceResult = (championshipLevel, race) => {
        if (race?.season && race?.round) {
            navigate(`/race-${championshipLevel.toLowerCase()}/${race.season}${race.round}`);
            trackButtonClick(`Home/Click/${championshipLevel}/View Full Results - ${race.season}${race.round}`)
        } else {
            console.error("Meeting key not found for this race.");
        }
    };

    // const circuitId = locationMap[location];

    const latestResultsLayout = () => {
        return (
                <div className="relative w-full flex flex-col items-center bg-glow-dark rounded-md">
                    <div className="flex flex-col items-center z-10 pt-32">
                        <p className="text-sm tracking-xs uppercase gradient-text-light">
                            Latest F1 Race Results
                        </p>
                        <p className="font-display text-xl text-center">
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
                        <div className="divider-glow-dark mb-16 -mt-4" />
                        <p className="text-center mb-56 w-2/3">
                            Get detailed stats, strategic insights, and experience the interactive telemetry map of the race.
                        </p>
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
                </div>
        );
    };

    const f1aWrapperClasses = "w-full";
    const f1aListClasses = "flex flex-col gap-4";
    const f1aH3Classes = " text-sm tracking-xs uppercase text-center mb-8";

    const latestF1aResultsLayout = (championshipLevel, data) => {
        return (
            <>
                <div className="relative w-full max-w-[350px]">
                    <div className="flex flex-col sm:flex-row gap-8 items-center py-[26px] -mx-16">
                        {/* {data?.race0?.length > 0 && (
                            <div className={f1aWrapperClasses}>
                                <h3 className={f1aH3Classes}>Rescheduled Race</h3>
                                <ul className={f1aListClasses}>
                                    {data?.race1.map(
                                        (result, resultIndex) => (
                                            <DriverCard
                                                key={resultIndex}
                                                championshipLevel={championshipLevel}
                                                darkBG
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
                        )} */}
                        {data?.race1?.length > 0 && (
                            <div className={f1aWrapperClasses}>
                                <h3 className={f1aH3Classes}>Race 1</h3>
                                <ul className={f1aListClasses}>
                                    {data?.race1.map(
                                        (result, resultIndex) => (
                                            <DriverCard
                                                key={resultIndex}
                                                championshipLevel={championshipLevel}
                                                darkBG
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
                        {data?.race2?.length > 0 && (
                            <div className={f1aWrapperClasses}>
                                <h3 className={f1aH3Classes}>Race 2</h3>
                                <ul className={f1aListClasses}>
                                    {data?.race2.map(
                                        (result, resultIndex) => (
                                            <DriverCard
                                                key={resultIndex}
                                                championshipLevel={championshipLevel}
                                                darkBG
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
                    <Button
                        as="button"
                        onClick={() => navigateToF1aRaceResult(championshipLevel, data)}
                        size="md"
                        className="-mb-24 mx-16 sm:mx-auto"
                    >
                        View Full Results
                    </Button>
                </div>
            </>
        );
    };

    const leagueButtons = (championshipLevel) => (
        <div className="flex flex-col items-center gap-8 w-fit">
            <Button
                onClick={() => {
                    navigate(`/${championshipLevel.toLowerCase()}/driver-standings`)
                    trackButtonClick(
                        `Home/Click/${championshipLevel}/View Driver Standings - /${championshipLevel.toLowerCase()}/driver-standings`
                    );
                }}
                size="sm"
                buttonStyle="hollow"
                className="w-full backdrop-blur-sm"
            >
                {championshipLevel} Driver Standings
            </Button>
            <Button
                onClick={() => {
                    navigate(`/${championshipLevel.toLowerCase()}/constructor-standings`)
                    trackButtonClick(
                        `Home/Click/${championshipLevel}/View Constructor Standings - /${championshipLevel.toLowerCase()}/constructor-standings`
                    );
                }}
                size="sm"
                buttonStyle="hollow"
                className="w-full backdrop-blur-sm"
            >
                {championshipLevel} Constructor Standings
            </Button>
        </div>
    )

    const leagueHeader = (championshipLevel, raceName) => (
        <div className="text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">
            <p className="text-sm tracking-xs uppercase gradient-text-light">
                Latest {championshipLevel} Academy Race Results
            </p>
            <p className="font-display text-xl leading-none mb-24">
                2025 {raceName}
            </p>
        </div> 
    )

    const ButtonClasses = "bg-glow-dark bg-glow--hover-dark rounded-lg w-full py-2 px-16 group";

    return (
        <div>
            <HeroSection layoutMobile={layoutMobile} />

            <section className="bg-gradient-to-b from-neutral-950 to-plum-500 pt-24 pb-48">
                <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center px-16">
                    {latestResultsLayout()}
                    <Button
                        as="button"
                        onClick={() => navigateToRaceResult(raceData)}
                        className="mb-48 -mt-24"
                        size="md"
                    >
                        View Full Race Details
                    </Button>
                    <div className="w-full flex flex-col gap-16 md:flex-row items-center justify-center"> 
                        <button
                            onClick={() => {
                                navigate("/driver-standings")
                                trackButtonClick(
                                    `Home/Click/F1/View Driver Standings - /driver-standings`
                                );
                            }}
                            className={ButtonClasses}
                        >
                             <p className="font-display text-xl group-hover:scale-95 transition-transform duration-300 -mb-12">
                                Driver Standings
                            </p>
                            <img
                                src={`${
                                    process.env.PUBLIC_URL +
                                    "/images/driversf1.png"
                                }`}
                                alt="formula 1 constructor championship"
                                className="w-[200px] mx-auto -mb-18 group-hover:scale-110 transition-transform duration-300"
                            />
                        </button>
                        <button
                            onClick={() => {
                                navigate("/constructor-standings")
                                trackButtonClick(
                                    `Home/Click/F1/View Constructor Standings - /constructor-standings`
                                );
                            }}
                            className={ButtonClasses}
                        >
                            <p className="font-display text-xl group-hover:scale-95 transition-transform duration-300 -mb-16">
                                Constructor Standings
                            </p>
                            <img
                                src={`${
                                    process.env.PUBLIC_URL +
                                    "/images/constructorf1.png"
                                }`}
                                alt="formula 1 constructor championship"
                                className="w-[200px] mx-auto -mb-12 group-hover:scale-110 transition-transform duration-300"
                            />
                        </button>
                    </div>
                </div>
            </section>
            <section ref={ref} className="my-72 ">
                <motion.div
                    className="max-w-screen-md mx-auto text-center mb-64"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    // style={{ y: yHeading }}
                >
                    <h2 className="heading-3 mb-16">
                        Stay Updated with the Latest Formula 2 and Formula 1 Academy Results
                    </h2>  
                </motion.div>
                <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-center max-md:gap-32">
                    <div className="w-full md:w-1/2 flex flex-col items-center mb-24">
                        <F1ALogo height={48} className="mx-auto mb-20" />
                        {leagueHeader('F1A', F1aRaceData?.raceName)}
                        <div className="bg-gradient-to-br from-fuchsia-600 via-blue-600 to-blue-400 rounded-lg w-fit relative mb-32">
                            <motion.img
                                className="w-[300px] absolute -left-32 z-0 max-sm:hidden"
                                src={`${
                                    process.env.PUBLIC_URL + "/images/plusPatternsPurple.png"
                                }`}
                                alt=""
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                                style={{ y: yDecoration2 }}
                            />
                            {latestF1aResultsLayout('F1A', F1aRaceData)}
                        </div>
                        {leagueButtons('F1A')}
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col items-center mb-24">
                        <F2Logo height={48} className="mx-auto mb-20" />   
                        {leagueHeader('F2', F2RaceData?.raceName)}
                        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg w-fit relative mb-32">  
                            <motion.img
                                className="w-[300px] absolute -left-32 z-0 max-sm:hidden"
                                src={`${
                                    process.env.PUBLIC_URL + "/images/plusPatterns.png"
                                }`}
                                alt=""
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                                style={{ y: yDecoration2 }}
                            />
                            {latestF1aResultsLayout('F2', F2RaceData)}
                        </div>  
                        {leagueButtons('F2')}
                    </div>
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
