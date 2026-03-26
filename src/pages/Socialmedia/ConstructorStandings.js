import React, { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { getConstructorStandings } from "./api";
import { darkenColor } from "../../utils/darkenColor";
import { ReactComponent as Logo } from "../../components/f1nsight-logo-26.svg";
import { getPositionChange, storeStandings } from "./utils";
import { getCurrentYear } from "../../utils/currentYear";
import teamColorsByYear from "../../utils/teamColors.json";

const currentYear = getCurrentYear();

const ConstructorStandings = ({ location, round }) => {
    const [constructorStandings, setConstructorStandings] = useState(null);
    const teamColors = teamColorsByYear[currentYear] || {};
    const podiumCarControls = useAnimationControls();

    useEffect(() => {
        getConstructorStandings(currentYear).then((standings) => {
            setConstructorStandings(standings);
            storeStandings('constructorStandings', standings); // Store for next comparison
        });
    }, []);

    console.log('constructorStandings', constructorStandings);
    console.log('teamColors', teamColors);

    const getTeamColor = (constructorId) =>
        teamColors[constructorId] ? `#${teamColors[constructorId]}` : "#222";

    const standings = constructorStandings || [];
    const secondPlace = standings.find(
        (standing) => Number(standing.position) === 2
    );
    const firstPlace = standings.find(
        (standing) => Number(standing.position) === 1
    );
    const thirdPlace = standings.find(
        (standing) => Number(standing.position) === 3
    );
    const podiumConstructors = [secondPlace, firstPlace, thirdPlace].filter(Boolean);

    useEffect(() => {
        if (podiumConstructors.length === 0) return;

        let isCancelled = false;
        const timeoutIds = [];

        const sleep = (ms) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(resolve, ms);
                timeoutIds.push(timeoutId);
            });

        const runLoop = async () => {
            while (!isCancelled) {
                podiumCarControls.set("hidden");
                await sleep(120);
                if (isCancelled) break;

                await podiumCarControls.start("visible");
                if (isCancelled) break;

                await sleep(5000);
                if (isCancelled) break;

                await podiumCarControls.start("fade");
                if (isCancelled) break;

                await sleep(500);
            }
        };

        runLoop();

        return () => {
            isCancelled = true;
            timeoutIds.forEach((id) => clearTimeout(id));
            podiumCarControls.stop();
        };
    }, [podiumCarControls, podiumConstructors.length]);

    const contructorItem = (standing) => {
        const color = getTeamColor(standing.constructor.constructorId);
        const positionChange = getPositionChange(standing.position, standing.constructor.constructorId, 'constructorStandings');
        
        return (
            <div className="standing-item w-full flex flex-col items-center" key={standing.constructor.constructorId}>
                <img
                    alt=""
                    className="z-10 -mb-4"
                    style={{
                        filter: `drop-shadow(0 0 16px ${darkenColor(color)}) drop-shadow(0 2px 8px #0008)`
                    }}
                    src={`${
                        process.env.PUBLIC_URL + `/images/${currentYear}/cars/` + standing.constructor.constructorId + ".png"
                    }`}
                    width={140}
                />
                <div className="constructor-stand flex flex-row justify-between w-full bg-glow">
                    <div className="bg-neutral-900/50 w-32 rounded-r-sm text-center flex items-center justify-center gap-2" style={{ borderRight: `2px solid ${color}` }}>
                        <span>{standing.position}</span>
                        {/* {positionChange && positionChange !== 0 && (
                            <span className={positionChange > 0 ? 'text-green-400' : 'text-red-400'}>
                                {positionChange > 0 ? `+${positionChange}` : positionChange}
                            </span>
                        )} */}
                    </div>
                    <p>{standing.constructor.name}</p>
                    <div className="bg-neutral-900/50 w-40 rounded-l-sm text-center" style={{ borderLeft: `2px solid ${color}` }}>{standing.points}</div>
                </div>
            </div>
        )
    }

    const podiumCarVariants = {
        hidden: {
            y: -500,
            opacity: 0,
        },
        visible: ({ finalYOffset = 0, animationDelay = 0 }) => ({
            y: finalYOffset,
            opacity: 1,
            transition: {
                duration: 1.9,
                delay: animationDelay,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
        fade: {
            opacity: 0,
            transition: {
                duration: 0.8,
                ease: "easeInOut",
            },
        },
    };

    if (!constructorStandings || constructorStandings.length === 0) {
        return <div className="social-media-container">Loading constructor standings...</div>;
    }

    return (
        <div 
            className="social-constructor-standings social-media-container grid grid-cols-2 relative"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg.png)` }}
        >
            <div className="leading-none absolute top-24 left-40 z-20">
                <div className="font-display mx-auto w-fit">
                    <p className=" text-neutral-400 text-[20px] ">{currentYear}</p>
                    <p className="text-gradient text-[20px]">Constructor</p>
                    <p className="text-gradient text-[25px]">Standings</p>
                </div>
                <hr className="w-full border-2 border-[#303030] my-16" />
                <div className="text-center uppercase text-xs text-neutral-400 tracking-sm">
                    <p>After round {round}</p>
                    <p>@ {location}</p>
                </div>
            </div>
            <div className="relative w-full h-full overflow-hidden">
                <div className="flex items-end justify-end z-10 h-full">
                    {podiumConstructors.map((standing, index) => {
                        const color = getTeamColor(standing.constructor.constructorId);
                        const position = Number(standing.position);
                        const initials = standing.constructor.name
                            .split(" ")
                            .slice(0, 2)
                            .map((word) => word[0] || "")
                            .join("");
                        const staggerDelayByPosition = {
                            1: 0,
                            2: 0.35,
                            3: 0.7,
                        };
                        const finalYOffsetByPosition = {
                            1: -180,
                            2: -230,
                            3: -250,
                        };
                        const finalYOffset = finalYOffsetByPosition[position] ?? 0;
                        const animationDelay = staggerDelayByPosition[position] ?? index * 0.25;

                        return (
                            <div
                                key={standing.constructor.constructorId}
                                className={`relative w-[32%] h-full`}
                                style={{
                                    background: `linear-gradient(to bottom, #111111 0%, ${darkenColor(color)}90 50%, #111111 100%)`,
                                }}
                            >
                                <motion.img
                                    alt={standing.constructor.name}
                                    src={`${
                                        process.env.PUBLIC_URL +
                                        `/images/${currentYear}/carTopView/` +
                                        standing.constructor.constructorId +
                                        `-large.png`
                                    }`}
                                    className="absolute right-[0px] top-1/2 -translate-y-1/2 z-20 w-[80px] max-w-none"
                                    style={{
                                        filter:
                                            "drop-shadow(0 10px 18px rgba(0,0,0,0.95)) drop-shadow(0 30px 40px rgba(0,0,0,0.8))",
                                    }}
                                    custom={{ finalYOffset, animationDelay }}
                                    variants={podiumCarVariants}
                                    initial="hidden"
                                    animate={podiumCarControls}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="divider-glow-dark-vertical rotate-180 absolute top-0 left-[220px]" />
            <div className="social-constructor-standings--teams flex flex-col items-center justify-between py-24 px-12">
                {constructorStandings.map((standing) => (
                    contructorItem(standing)
                ))}
            </div>
            <Logo className="h-32 absolute bottom-32 left-[78px]" />
        </div>
    );
};

export default ConstructorStandings;
