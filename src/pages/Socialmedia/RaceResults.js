import classNames from "classnames";
import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { lightenColor } from "../../utils/lightenColor";
import { getCurrentYear } from "../../utils/currentYear";
import { Loading } from "../../components";

import { ReactComponent as Logo } from "../../components/f1nsight-logo-26.svg";

const currentYear = getCurrentYear();

const RaceResults = ({ raceResults, raceName, isLoading = false }) => {
    const carControls = useAnimationControls();

    useEffect(() => {
        if (!raceResults || raceResults.length === 0) return;

        let isCancelled = false;
        const timeoutIds = [];

        const sleep = (ms) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(resolve, ms);
                timeoutIds.push(timeoutId);
            });

        const runLoop = async () => {
            while (!isCancelled) {
                carControls.set("hidden");
                await sleep(180);
                if (isCancelled) break;

                await carControls.start("visible");
                if (isCancelled) break;

                await sleep(6500);
                if (isCancelled) break;

                await carControls.start("fade");
                if (isCancelled) break;

                await sleep(900);
            }
        };

        runLoop();

        return () => {
            isCancelled = true;
            timeoutIds.forEach((id) => clearTimeout(id));
            carControls.stop();
        };
    }, [carControls, raceResults]);

    const carVariants = {
        hidden: {
            x: -500,
            opacity: 0,
        },
        visible: (order = 0) => ({
            x: 0,
            opacity: 1,
            transition: {
                duration: 2.4,
                delay: order * 0.16,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
        fade: {
            opacity: 0,
            transition: {
                duration: 1.1,
                ease: "easeInOut",
            },
        },
    };

    const getStaggerOrder = (driver, fallbackIndex) => {
        // Use rendered list order for smoother pacing within each column.
        return fallbackIndex;
    };

    const RIGHT_COLUMN_DELAY_OFFSET = 12;

    if (isLoading) {
        return (
            <div className="social-media-container bg-glow-dark flex items-center justify-center">
                <Loading className="scale-75" message="Loading race results..." />
            </div>
        );
    }

    if (!raceResults || raceResults.length === 0) {
        return (
            <div className="social-media-container bg-glow-dark">
                No race results data available.
            </div>
        );
    }

    const raceResultItem = (driver, staggerOrder = 0) => {
        const colorgradientStyletoLeft = {
            background: `linear-gradient(to left, ${lightenColor(
                driver.driver.team_colour
            )}30, ${lightenColor(driver.driver.team_colour)}90)`,
            backgroundColor: "#000000",
        };

        return (
            <div
                className={classNames(
                    "starting-grid--item flex w-full relative overflow-hidden"
                )}
            >
                <div
                    className={classNames(
                        "divider-glow-dark absolute top-0 !h-8"
                    )}
                />
                <div
                    style={colorgradientStyletoLeft}
                    className={classNames("grow flex flex-row items-center")}
                >
                    <p className="font-display text-white leading-none ml-8 -mr-12">
                        {driver.position
                            ? `P${driver.position}`
                            : driver.dnf
                            ? "DNF"
                            : driver.dns
                            ? "DNS"
                            : ""}
                    </p>
                    <div className="w-[63px] h-[63px] overflow-hidden flex items-start justify-center">
                        <img
                            alt=""
                            className="max-w-[100px]"
                            src={`${
                                process.env.PUBLIC_URL +
                                `/images/${currentYear}/drivers/` +
                                driver.driver.name_acronym +
                                ".png"
                            }`}
                        />
                    </div>
                    <div
                        className={classNames(
                            "flex flex-col pt-12 -mb-16 -ml-8"
                        )}
                    >
                        <p className="text-xs tracking-sm leading-none gradient-text uppercase">
                            {driver.driver?.first_name || "Unknown"}
                        </p>
                        <p className="font-display leading-none gradient-text -mt-1">
                            {driver.driver?.last_name || "Unknown"}
                        </p>
                        <motion.img
                            alt=""
                            className="drop-shadow-[0_0_14px_rgba(0,0,0,0.75)] z-10 -mt-4"
                            custom={staggerOrder}
                            variants={carVariants}
                            initial="hidden"
                            animate={carControls}
                            src={`${
                                process.env.PUBLIC_URL +
                                `/images/${currentYear}/cars/` +
                                driver.driver.constructorId +
                                ".png"
                            }`}
                            width={120}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const headerFooterBG = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/socialBGarrows.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#111111",
    };

    const decorations = [
        { top: "-320px", left: "-200px" },
        { top: "100px", left: "300px" },
        { top: "350px", left: "-230px" },
        { top: "730px", left: "300px" },
    ];

    const formatSessionLabel = (sessionName = "") => {
        const normalized = String(sessionName).toLowerCase();
        if (normalized.includes("sprint")) return "Sprint Race";
        if (normalized === "race") return "Feature Race";
        return sessionName || "Race";
    };

    return (
        <div className="relative starting-grid overflow-hidden">
            {raceResults.map((raceResult) => (
                <div
                    className="social-media-container bg-glow-dark flex flex-col justify-between"
                    key={raceResult.session_key}
                    style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg.png)`,
                    }}
                >
                    <div
                        style={headerFooterBG}
                        className="starting-grid--header flex flex-col items-center justify-center leading-none py-32"
                    >
                        <p className=" text-lg font-display z-10">
                            Race Result
                        </p>
                        <p className=" text-xs uppercase tracking-sm z-10">
                            {raceName} {formatSessionLabel(raceResult.session_name)}
                        </p>
                    </div>
                    <div className="starting-grid--columns flex flex-row z-10">
                        {/* Left Column - Positions 1-10 */}
                        <div className="grow relative overflow-hidden">
                            {raceResult.result
                                .filter(
                                    (driver) =>
                                        driver.position >= 1 &&
                                        driver.position <= 11
                                )
                                .map((SGdriver, idx) => (
                                    <div key={SGdriver.driver_number || idx}>
                                        {raceResultItem(
                                            SGdriver,
                                            getStaggerOrder(SGdriver, idx)
                                        )}
                                    </div>
                                ))}
                        </div>

                        {/* Right Column - Positions 11-20 */}
                        <div className="grow relative overflow-hidden">
                            {raceResult.result
                                .filter(
                                    (driver) =>
                                        (driver.position >= 12 &&
                                            driver.position <= 22) ||
                                        ((driver.position === null ||
                                            driver.position === undefined) &&
                                            (driver.dnf || driver.dns))
                                )
                                .map((SGdriver, idx) => (
                                    <div key={SGdriver.driver_number || idx}>
                                        {raceResultItem(
                                            SGdriver,
                                            getStaggerOrder(SGdriver, idx) +
                                                RIGHT_COLUMN_DELAY_OFFSET
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div
                        style={headerFooterBG}
                        className="starting-grid--footer flex flex-col items-center justify-center leading-none py-16"
                    >
                        <Logo className="h-32" />
                    </div>
                </div>
            ))}

            {decorations.map((decoration, index) => (
                <img
                    alt=""
                    style={decoration}
                    className="absolute z-[0] opacity-20"
                    src={`${
                        process.env.PUBLIC_URL + "images/plusPatternGray.svg"
                    }`}
                    width={400}
                    key={index}
                />
            ))}
        </div>
    );
};

export default RaceResults;
