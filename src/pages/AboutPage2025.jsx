import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button, DriverCard, Footer2025 } from "../components";
import { fetchMostRecentRace } from "../utils/api";
import { fetchMostRecentRaceWeekend } from "../utils/apiF1a";
import { F1ALogo } from "../components/F1ALogo";
import { F2Logo } from "../components/F2Logo";
import HeroSection from "../layouts/HeroSection";
import ComparisonsSection from "../layouts/ComparisonsSection";
import ArSection from "../layouts/ArSection";
import TelemetrySection from "../layouts/TelemetrySection";
import { getCurrentYear } from "../utils/currentYear";

const currentYear = getCurrentYear();

export function AboutPage2025() {
  const [raceData, setRaceData] = useState(null);
  const [f1aRaceData, setF1aRaceData] = useState(null);
  const [f2RaceData, setF2RaceData] = useState(null);
  const snapContainerRef = useRef(null);
  const [layoutSmall, setLayoutSmall] = useState();
  const [layoutMobile, setLayoutMobile] = useState();
  const selectedYear = currentYear;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yDecoration2 = useTransform(scrollYProgress, [0, 1], [150, -50]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const mostRecentRace = await fetchMostRecentRace(currentYear);
      const mostRecentF1aRaceWeekend = await fetchMostRecentRaceWeekend(
        currentYear,
        "F1A",
      );
      const mostRecentF2RaceWeekend = await fetchMostRecentRaceWeekend(
        currentYear,
        "F2",
      );

      setRaceData(mostRecentRace);
      setF1aRaceData(mostRecentF1aRaceWeekend);
      setF2RaceData(mostRecentF2RaceWeekend);
    };

    fetchData();

    const handleLayout = () => {
      setLayoutSmall(window.innerWidth > 767 && window.innerWidth < 1024);
      setLayoutMobile(window.innerWidth < 1024);
    };
    handleLayout();

    window.addEventListener("resize", handleLayout);
    return () => window.removeEventListener("resize", handleLayout);
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

  const navigateToRaceResult = (race) => {
    if (race?.meetingKey) {
      navigate(`/race/${race.meetingKey}`);
    } else {
      console.error("Meeting key not found for this race.");
    }
  };

  const navigateToF1aRaceResult = (championshipLevel, race) => {
    if (race?.season && race?.round) {
      navigate(
        `/race-${championshipLevel.toLowerCase()}/${race.season}${race.round}`,
      );
    } else {
      console.error("Meeting key not found for this race.");
    }
  };

  const f1aWrapperClasses = "w-full";
  const f1aListClasses = "flex flex-col gap-4";
  const f1aH3Classes = " text-sm tracking-xs uppercase text-center mb-8";

  const latestF1aResultsLayout = (championshipLevel, data) => {
    const race1Label = championshipLevel === "F2" ? "Sprint Race" : "Race 1";
    const race2Label = championshipLevel === "F2" ? "Race" : "Race 2";

    return (
      <div className="relative w-full max-w-[700px]">
        <div className="flex flex-col sm:flex-row gap-8 items-center py-[26px]">
          {data?.race1?.length > 0 && (
            <div className={f1aWrapperClasses}>
              <h3 className={f1aH3Classes}>{race1Label}</h3>
              <ul className={f1aListClasses}>
                {data.race1.map((result, resultIndex) => (
                  <DriverCard
                    key={resultIndex}
                    championshipLevel={championshipLevel}
                    darkBG
                    index={resultIndex}
                    driver={result.Driver}
                    startPosition={parseInt(result.grid, 10)}
                    endPosition={parseInt(result.position, 10)}
                    year={selectedYear}
                    time={result.Time?.time || result.status}
                    fastestLap={result.FastestLap}
                    layoutSmall={layoutSmall}
                  />
                ))}
              </ul>
            </div>
          )}
          {data?.race2?.length > 0 && (
            <div className={f1aWrapperClasses}>
              <h3 className={f1aH3Classes}>{race2Label}</h3>
              <ul className={f1aListClasses}>
                {data.race2.map((result, resultIndex) => (
                  <DriverCard
                    key={resultIndex}
                    championshipLevel={championshipLevel}
                    darkBG
                    index={resultIndex}
                    driver={result.Driver}
                    startPosition={parseInt(result.grid, 10)}
                    endPosition={parseInt(result.position, 10)}
                    year={selectedYear}
                    time={result.Time?.time || result.status}
                    fastestLap={result.FastestLap}
                    layoutSmall={layoutSmall}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button
          as="button"
          onClick={() => navigateToF1aRaceResult(championshipLevel, data)}
          size="md"
          className="mx-16 sm:mx-auto mb-32"
        >
          View Full Results
        </Button>
      </div>
    );
  };

  const leagueButtons = (championshipLevel) => (
    <div className="flex flex-col items-center gap-8 w-fit mt-12">
      <Button
        onClick={() => {
          navigate(`/${championshipLevel.toLowerCase()}/driver-standings`);
        }}
        size="sm"
        buttonStyle="hollow"
        className="w-full backdrop-blur-sm"
      >
        {championshipLevel} Driver Standings
      </Button>
      <Button
        onClick={() => {
          navigate(`/${championshipLevel.toLowerCase()}/constructor-standings`);
        }}
        size="sm"
        buttonStyle="hollow"
        className="w-full backdrop-blur-sm"
      >
        {championshipLevel} Constructor Standings
      </Button>
    </div>
  );

  const leagueHeader = (championshipLevel, raceName) => (
    <div className="text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">
      <p className="text-lg tracking-xs uppercase gradient-text-light">
        Latest {championshipLevel}{" "}
        {championshipLevel === "F1A" ? "Academy " : ""}Race Results
      </p>
      <p className="font-display text-3xl leading-none mb-24 mt-4">
        {selectedYear} {raceName}
      </p>
    </div>
  );

  return (
    <div className="snap-container" ref={snapContainerRef}>
      <HeroSection layoutMobile={layoutMobile} container={snapContainerRef} />
      <TelemetrySection
        layoutMobile={layoutMobile}
        onClick={() => navigateToRaceResult(raceData)}
        container={snapContainerRef}
      />
      <ComparisonsSection
        layoutMobile={layoutMobile}
        container={snapContainerRef}
      />
      <ArSection layoutMobile={layoutMobile} container={snapContainerRef} />
      <section
        ref={ref}
        className="min-h-screen snap-start overflow-hidden flex flex-col items-center justify-center py-72"
      >
        <motion.div
          className="max-w-none mx-auto text-center mb-64"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="heading-3 mb-16">
            Stay Updated with the Latest <br /> F1 Academy and Formula 2 Results
          </h2>
        </motion.div>
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-center max-md:gap-32">
          <div className="w-full md:w-1/2 flex flex-col items-center mb-24">
            <F1ALogo height={48} className="mx-auto mb-20" />
            {leagueHeader("F1A", f1aRaceData?.raceName)}
            <div className="relative w-fit flex flex-col items-center mb-32">
              <div className="absolute inset-y-0 left-8 right-8 bg-gradient-to-br from-fuchsia-600 via-blue-600 to-blue-400 rounded-lg z-0" />
              <div className="relative z-10">
                <motion.img
                  className="w-[300px] absolute -left-32 z-0 max-sm:hidden pointer-events-none"
                  src="/images/plusPatternsPurple.png"
                  alt=""
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  style={{ y: yDecoration2 }}
                />
                {latestF1aResultsLayout("F1A", f1aRaceData)}
              </div>
            </div>
            {leagueButtons("F1A")}
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center mb-24">
            <F2Logo height={48} className="mx-auto mb-20" />
            {leagueHeader("F2", f2RaceData?.raceName)}
            <div className="relative w-fit flex flex-col items-center mb-32">
              <div className="absolute inset-y-0 left-8 right-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg z-0" />
              <div className="relative z-10">
                <motion.img
                  className="w-[300px] absolute -left-32 z-0 max-sm:hidden pointer-events-none"
                  src="/images/plusPatterns.png"
                  alt=""
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  style={{ y: yDecoration2 }}
                />
                {latestF1aResultsLayout("F2", f2RaceData)}
              </div>
            </div>
            {leagueButtons("F2")}
          </div>
        </div>
      </section>
      <section
        className="snap-start bg-black"
        style={{ scrollSnapAlign: "start" }}
      >
        <Footer2025 />
      </section>
    </div>
  );
}
