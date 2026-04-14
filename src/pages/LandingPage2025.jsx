import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  RaceResultItem,
  TeammateComparisonButton,
  ViewLatestRaceButton,
  Footer2025,
} from "../components";
import { fetchMostRecentRace } from "../utils/api";
import { getCurrentYear } from "../utils/currentYear";
import DatesSection from "../layouts/DatesSection";

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
  const snapContainerRef = useRef(null);
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const [isHeroImageVisible, setIsHeroImageVisible] = useState(true);
  const [isBelowLargeBreakpoint, setIsBelowLargeBreakpoint] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < LARGE_BREAKPOINT_PX
      : false,
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
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key === "Home" || e.code === "Home") {
        e.preventDefault();
        snapContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "End" || e.code === "End") {
        e.preventDefault();
        if (snapContainerRef.current) {
          snapContainerRef.current.scrollTo({
            top: snapContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isBelowLargeBreakpoint) {
      setHeroBgIndex(HERO_STATIC_SMALL_SCREEN_INDEX);
      setIsHeroImageVisible(true);
      return undefined;
    }

    let swapTimeoutId;

    const rotationInterval = window.setInterval(
      () => {
        setIsHeroImageVisible(false);

        swapTimeoutId = window.setTimeout(() => {
          setHeroBgIndex(
            (currentIndex) =>
              (currentIndex + 1) % HERO_BACKGROUND_IMAGES.length,
          );
          window.requestAnimationFrame(() => {
            setIsHeroImageVisible(true);
          });
        }, HERO_FADE_MS);
      },
      HERO_HOLD_MS + HERO_FADE_MS * 2,
    );

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
    } else {
      console.error("Meeting key not found for this race.");
    }
  };
  const latestResultsLayout = () => {
    return (
      <>
        <div className="flex flex-col items-center z-10">
          <p className="text-xl tracking-xl uppercase gradient-text-light mb-16">
            Latest F1 Race Results
          </p>
          <p className="heading-2 text-center uppercase">
            {selectedYear} {raceData?.raceName}
          </p>
          <ul className="race-results__list mt-32">
            {raceData?.raceResults.map((result, resultIndex) => (
              <RaceResultItem
                className={`race-results__list__item-${resultIndex + 1}`}
                carNumber={result.number}
                driver={result.driver}
                fastestLap={result.fastestLap}
                startPosition={parseInt(result.grid, 10)}
                key={resultIndex}
                index={resultIndex}
                endPosition={parseInt(result.position, 10)}
                status={result.status}
                time={result.time}
                year={selectedYear}
                // wireframe={race.results.length === 0}
              />
            ))}
          </ul>

          <div className="divider-glow-dark mb-16 -mt-4" />
          <p className="text-center mb-56 w-2/3">
            Get detailed stats, strategic insights, and experience the
            interactive telemetry map of the race.
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
              raceData && raceData.Circuit && raceData.Circuit.circuitId
                ? `${
                    "/mapsAnimated/" +
                    raceData.Circuit.circuitId +
                    "Animated.mp4"
                  }`
                : null
            }
            loop
            autoPlay
            muted
            playsInline
            className="object-cover opacity-15 h-full w-full"
          />
        </div>
      </>
    );
  };

  const ButtonClasses =
    "bg-glow-dark bg-glow--hover-dark rounded-lg w-full py-2 px-16 group";
  const heroImageSource = HERO_BACKGROUND_IMAGES[heroBgIndex];
  const topThreeDriverCodes = (raceData?.raceResults || [])
    .map((result) => result?.driver?.code)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="snap-container" ref={snapContainerRef}>
      <section className="bg-black relative h-[100dvh] snap-start overflow-hidden flex items-center justify-center">
        <img
          src={heroImageSource}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
          style={{
            opacity: isHeroImageVisible ? 0.4 : 0,
            filter: "brightness(1.2) contrast(1.0)",
            transitionDuration: `${HERO_FADE_MS}ms`,
          }}
          onError={(event) => {
            event.target.onerror = null;
            event.target.src = "/images/HeroImage.png"; // Fallback to a core static hero if rotation fails
            console.error(
              "Landing hero image failed to load:",
              event.currentTarget.src,
            );
          }}
        />

        <div className="mx-auto text-center px-16 relative z-10">
          <h1 className="heading-1 mb-16 leading-none">
            Go Beyond the Race Results
          </h1>
          <p className="text-neutral-300 text-3xl mb-24 mx-auto leading-none">
            Explore telemetry, compare drivers, and understand every race in
            depth.
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
      <section className="h-[100dvh] snap-start relative flex items-center justify-center bg-neutral-950 bg-glow-dark-bottom overflow-hidden pt-[64px]">
        {latestResultsLayout()}
      </section>

      <DatesSection />

      <section className="snap-start bg-black">
        <Footer2025 />
      </section>
    </div>
  );
}
