import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, RaceResultItem, TeammateComparisonButton, ViewLatestRaceButton } from "../components";
import { trackButtonClick } from "../utils/gaTracking";
import { fetchMostRecentRace } from "../utils/api";
import { getCurrentYear } from "../utils/currentYear";

const currentYear = getCurrentYear();
const HERO_BACKGROUND_IMAGES = [
    "/images/hero2.jpg",
    "/images/hero3.jpg",
    "/images/hero4.jpg",
    "/images/hero5.jpg",
];
const HERO_STATIC_SMALL_SCREEN_INDEX = 3;
const LARGE_BREAKPOINT_PX = 1024;
const HERO_HOLD_MS = 9000;
const HERO_FADE_MS = 1200;

export function LandingPage2025() {
    const [raceData, setRaceData] = useState(null);
    const [heroBgIndex, setHeroBgIndex] = useState(0);
    const [isHeroImageVisible, setIsHeroImageVisible] = useState(true);
    const [isBelowLargeBreakpoint, setIsBelowLargeBreakpoint] = useState(
        typeof window !== "undefined" ? window.innerWidth < LARGE_BREAKPOINT_PX : false
    );
    const selectedYear = currentYear;

    useEffect(() => {
        const fetchData = async () => {
            const mostRecentRace = await fetchMostRecentRace(currentYear);
            setRaceData(mostRecentRace);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsBelowLargeBreakpoint(window.innerWidth < LARGE_BREAKPOINT_PX);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isBelowLargeBreakpoint) {
            setHeroBgIndex(HERO_STATIC_SMALL_SCREEN_INDEX);
            setIsHeroImageVisible(true);
            return undefined;
        }

        let swapTimeoutId;

        const rotationInterval = window.setInterval(() => {
            setIsHeroImageVisible(false);

            swapTimeoutId = window.setTimeout(() => {
                setHeroBgIndex((currentIndex) =>
                    (currentIndex + 1) % HERO_BACKGROUND_IMAGES.length
                );
                window.requestAnimationFrame(() => {
                    setIsHeroImageVisible(true);
                });
            }, HERO_FADE_MS);
        }, HERO_HOLD_MS + HERO_FADE_MS * 2);

        return () => {
            window.clearInterval(rotationInterval);
            if (swapTimeoutId) {
                window.clearTimeout(swapTimeoutId);
            }
        };
    }, [isBelowLargeBreakpoint]);

    let navigate = useNavigate();
    const navigateToRaceResult = (race) => {
        if (race?.meetingKey) {
            navigate(`/race/${race.meetingKey}`);
            trackButtonClick(`Home/Click/F1/View Full Results - ${`/race/${race.meetingKey}`}`);
        } else {
            console.error("Meeting key not found for this race.");
        }
    };
    const latestResultsLayout = () => {
        return (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-glow-dark">
                    <div className="flex flex-col items-center z-10">
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
                        <Button
                            as="button"
                            onClick={() => navigateToRaceResult(raceData)}
                            className="mb-48 -mt-24 mx-auto"
                            size="md"
                        >
                            View Full Race Details
                        </Button>
                    </div>

                    <div className="bg-neutral-950/40 absolute w-full h-full overflow-hidden">
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
                </div>
        );
    };

    const ButtonClasses = "bg-glow-dark bg-glow--hover-dark rounded-lg w-full py-2 px-16 group";
    const heroImageSource = HERO_BACKGROUND_IMAGES[heroBgIndex];
    const topThreeDriverCodes = (raceData?.raceResults || [])
        .map((result) => result?.driver?.code)
        .filter(Boolean)
        .slice(0, 3);

    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
            <section className="relative h-screen snap-start overflow-hidden flex items-center justify-center">
                <img
                    src={heroImageSource}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
                    style={{
                        opacity: isHeroImageVisible ? 0.5 : 0,
                        transitionDuration: `${HERO_FADE_MS}ms`,
                    }}
                    onError={(event) => {
                        // Helps quickly diagnose broken public image paths in dev.
                        console.error("Landing hero image failed to load:", event.currentTarget.src);
                    }}
                />
                <div className="absolute inset-0 bg-neutral-950/35" />
                <div className="mx-auto text-center px-16 relative z-10">
                    <h1 className="heading-1 mb-16 leading-none">
                        Go Beyond the Race Results
                    </h1>
                    <p className="text-neutral-300 text-xl mb-24 mx-auto leading-none">
                        Explore telemetry, compare drivers, and understand every race in depth.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mt-48 sm:mt-96">
                        <ViewLatestRaceButton
                            meetingKey={raceData?.meetingKey}
                            driverCodes={topThreeDriverCodes}
                            year={selectedYear}
                        />
                        <TeammateComparisonButton year={2026} />
                    </div>
                </div>
            </section>
            <section className="h-screen snap-start flex items-start landing-page-snap-section">
                    {latestResultsLayout()}
                    
                    {/* <div className="w-full flex flex-col gap-16 md:flex-row items-center justify-center"> 
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
                    </div> */}
            </section>
        </div>
    );
}
