import classNames from "classnames";
import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { darkenColor } from "../../utils/darkenColor";
import { ReactComponent as Logo } from "../../components/f1nsight-logo-26.svg";
import { Loading } from "../../components";
import { getCurrentYear } from "../../utils/currentYear";

const currentYear = getCurrentYear();

const StartingGrid = ({ startingGrids, raceName, isLoading = false }) => {
    const rowControls = useAnimationControls();

    useEffect(() => {
        if (!startingGrids || startingGrids.length === 0) return;

        let isCancelled = false;
        const timeoutIds = [];

        const sleep = (ms) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(resolve, ms);
                timeoutIds.push(timeoutId);
            });

        const runLoop = async () => {
            while (!isCancelled) {
                rowControls.set("hidden");
                await sleep(180);
                if (isCancelled) break;

                await rowControls.start("visible");
                if (isCancelled) break;

                await sleep(6500);
                if (isCancelled) break;

                await rowControls.start("fade");
                if (isCancelled) break;

                await sleep(900);
            }
        };

        runLoop();

        return () => {
            isCancelled = true;
            timeoutIds.forEach((id) => clearTimeout(id));
            rowControls.stop();
        };
    }, [rowControls, startingGrids]);

    const startingGridItem = (driver, reversed = false, staggerOrder = 0) => {
        const colorgradientStyletoRight = {
            background: `linear-gradient(to right, ${darkenColor(driver.driver.team_colour)}30, ${darkenColor(driver.driver.team_colour)}90)`,
            backgroundColor: '#000000'
        }
        const colorgradientStyletoLeft = {
            background: `linear-gradient(to left, ${darkenColor(driver.driver.team_colour)}30, ${darkenColor(driver.driver.team_colour)}90)`,
            backgroundColor: '#000000'   
        }
        
        return (
            <div className={classNames("starting-grid--item flex w-full h-[56px] relative", reversed ? "flex-row-reverse" : "flex-row")}
            >
                <div 
                    style={{
                        left: reversed ? "0" : "auto",
                        right: reversed ? "auto" : "0" 
                    }} 
                    className={classNames("divider-glow-dark absolute top-0 !h-8 !w-3/4")} 
                />
                <div className={classNames("flex flex-row items-center w-[64px] ", reversed ? "flex-row-reverse" : "flex-row")}>
                    <motion.img
                        alt=""
                        className="drop-shadow-[0_0_7px_rgba(0,0,0,0.90)]"
                        custom={staggerOrder}
                        variants={rowVariants}
                        initial="hidden"
                        animate={rowControls}
                        src={`${
                            process.env.PUBLIC_URL + `/images/${currentYear}/carTopView/` + driver.driver.constructorId + ".png"
                        }`}
                        width={27}
                    />
                    <div className={classNames("flex flex-col", reversed ? "items-end" : "items-start")}>
                        <p className="font-display text-sm text-white leading-none">P{driver.position}</p>
                        <p className="font-display text-xs text-neutral-400 leading-none ">{driver.driver?.name_acronym || 'Unknown'}</p>
                    </div>
                </div>
                <div style={reversed ? colorgradientStyletoRight : colorgradientStyletoLeft} className={classNames("grow flex flex-row items-center", reversed ? "flex-row-reverse" : "flex-row")}>
                    <img
                        alt=""
                        className="drop-shadow-[0_0_14px_rgba(0,0,0,0.75)]"
                        src={`${
                            process.env.PUBLIC_URL + `/images/${currentYear}/drivers/` + driver.driver.name_acronym + ".png"
                        }`}
                        width={56}
                    />
                    <div className={classNames("flex flex-col", reversed ? "items-end -mr-12" : "items-start -ml-12")}>
                        <p className="text-xs leading-none gradient-text tracking-xs uppercase ">{driver.driver?.first_name || 'Unknown'}</p>
                        <p className={("text-sm font-display leading-none gradient-text -mt-1")}>{driver.driver?.last_name || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        )
    }

    const headerFooterBG = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/socialBGarrows.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#111111"
    }

    const decorations = [
        { top: "-320px", left: "-200px"},
        { top: "100px", left: "300px"},
        { top: "350px", left: "-230px"},
        { top: "730px", left: "300px"},
    ]

    const rowVariants = {
        hidden: {
            y: 2000,
            opacity: 0,
        },
        visible: (order = 0) => ({
            y: 0,
            opacity: 1,
            transition: {
                duration: 2.6,
                delay: order * 0.18,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
        fade: {
            opacity: 0,
            transition: {
                duration: 1.2,
                ease: "easeInOut",
            },
        },
    };

    const getStaggerOrder = (driver, fallbackIndex) => {
        const positionNumber = Number(driver?.position);
        if (Number.isFinite(positionNumber) && positionNumber > 0) {
            return positionNumber - 1;
        }
        return fallbackIndex;
    };

    if (isLoading) {
        return (
            <div className="social-media-container bg-glow-dark flex items-center justify-center">
                <Loading className="scale-75" message="Loading starting grid..." />
            </div>
        );
    }

    if (!startingGrids || startingGrids.length === 0) {
        return <div className="social-media-container bg-glow-dark">No starting grid data available.</div>;
    }

    const formatSessionLabel = (sessionName = "") => {
        const normalized = String(sessionName).toLowerCase();
        if (normalized.includes("sprint")) return "Sprint Race";
        if (normalized === "race") return "Feature Race";
        return sessionName || "Race";
    };

    return (
        <div className="relative starting-grid overflow-hidden">
            {startingGrids.map((startingGrid) => (
                <div 
                    className="social-media-container bg-glow-dark flex flex-col justify-between" 
                    key={startingGrid.session_key}
                    style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg.png)` }}
                >
                    <div
                        style={headerFooterBG}
                        className="starting-grid--header flex flex-col items-center justify-center leading-none py-32"
                    >
                        <p className="text-lg font-display z-10">Starting Grid</p>
                        <p className="text-xs uppercase tracking-sm z-10">
                            {raceName} {formatSessionLabel(startingGrid.session_name)}
                        </p>
                    </div>
                    <div className="starting-grid--columns flex flex-row z-10">
                        {/* Left Column - Odd Indexes */}
                        <div className="grow relative">
                            {startingGrid.grid
                                .filter((_, idx) => idx % 2 === 0) // Odd positions (0, 2, 4, etc.)
                                .map((SGdriver, idx) => (
                                    <div key={SGdriver.driver_number || idx}>
                                        {startingGridItem(
                                            SGdriver,
                                            true,
                                            getStaggerOrder(SGdriver, idx)
                                        )}
                                    </div>
                                ))}
                            <div className={classNames("divider-glow-dark-vertical absolute top-[0] right-[54px] rotate-180")} />
                        </div>
                        
                        {/* Right Column - Even Indexes */}
                        <div className="grow mt-24 relative">
                            {startingGrid.grid
                                .filter((_, idx) => idx % 2 === 1) // Even positions (1, 3, 5, etc.)
                                .map((SGdriver, idx) => (
                                    <div key={SGdriver.driver_number || idx}>
                                        {startingGridItem(
                                            SGdriver,
                                            false,
                                            getStaggerOrder(SGdriver, idx)
                                        )}
                                    </div>
                                ))}
                            <div className={classNames("divider-glow-dark-vertical absolute top-[0] left-[54px]")} />
                        </div>
                    </div>
                    <div
                        style={headerFooterBG}
                        className="starting-grid--footer flex flex-col items-center justify-center leading-none py-16 z-10"
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
                    src={`${process.env.PUBLIC_URL + "images/plusPatternGray.svg"}`}
                    width={400} 
                    key={index}
                />
            ))}
        </div>
    );
};

export default StartingGrid;
