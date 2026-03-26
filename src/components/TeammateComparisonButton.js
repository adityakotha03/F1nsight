import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { trackButtonClick } from "../utils/gaTracking";
import teamColorsByYear from "../utils/teamColors.json";

const DEFAULT_YEAR = 2026;
const TEAMMATE_TEAMS = [
    {
        constructorId: "ferrari",
        teamName: "Ferrari",
        drivers: ["LEC", "HAM"],
    },
    {
        constructorId: "mclaren",
        teamName: "McLaren",
        drivers: ["NOR", "PIA"],
    },
    {
        constructorId: "mercedes",
        teamName: "Mercedes",
        drivers: ["RUS", "ANT"],
    },
    {
        constructorId: "red_bull",
        teamName: "Red Bull",
        drivers: ["VER", "HAD"],
    },
    {
        constructorId: "rb",
        teamName: "Racing Bulls",
        drivers: ["LAW", "LIN"],
    },
    {
        constructorId: "aston_martin",
        teamName: "Aston Martin",
        drivers: ["ALO", "STR"],
    },
    {
        constructorId: "williams",
        teamName: "Williams",
        drivers: ["ALB", "SAI"],
    },
    {
        constructorId: "alpine",
        teamName: "Alpine",
        drivers: ["GAS", "COL"],
    },
    {
        constructorId: "haas",
        teamName: "Haas",
        drivers: ["OCO", "BEA"],
    },
    {
        constructorId: "audi",
        teamName: "Audi",
        drivers: ["HUL", "BOR"],
    },
    {
        constructorId: "cadillac",
        teamName: "Cadillac",
        drivers: ["PER", "BOT"],
    },
];

export function TeammateComparisonButton({
    year = DEFAULT_YEAR,
    className,
}) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [activeTeam, setActiveTeam] = useState(TEAMMATE_TEAMS[0]);
    const hoverOutTimeoutRef = useRef(null);

    const targetPath = useMemo(
        () => `/teammates-comparison/${year}/${activeTeam.constructorId}`,
        [activeTeam.constructorId, year]
    );
    const activeTeamColor =
        teamColorsByYear[String(year)]?.[activeTeam.constructorId] || "5F0B84";

    const pickRandomTeam = (currentConstructorId) => {
        if (TEAMMATE_TEAMS.length < 2) return TEAMMATE_TEAMS[0];

        let randomTeam = TEAMMATE_TEAMS[Math.floor(Math.random() * TEAMMATE_TEAMS.length)];
        while (randomTeam.constructorId === currentConstructorId) {
            randomTeam = TEAMMATE_TEAMS[Math.floor(Math.random() * TEAMMATE_TEAMS.length)];
        }
        return randomTeam;
    };

    const handleMouseEnter = () => {
        if (hoverOutTimeoutRef.current) {
            window.clearTimeout(hoverOutTimeoutRef.current);
            hoverOutTimeoutRef.current = null;
        }
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);

        hoverOutTimeoutRef.current = window.setTimeout(() => {
            setActiveTeam((currentTeam) => pickRandomTeam(currentTeam.constructorId));
            hoverOutTimeoutRef.current = null;
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (hoverOutTimeoutRef.current) {
                window.clearTimeout(hoverOutTimeoutRef.current);
            }
        };
    }, []);

    const navigateToSelectedTeam = () => {
        navigate(targetPath);
        trackButtonClick(
            `Home/Click/F1/View Teammate Comparison - ${targetPath}`
        );
    };

    return (
        <div
            className={classNames("relative inline-flex items-end", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={classNames(
                    "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full flex items-end justify-center -space-x-32 z-20 transition-all duration-300 ease-out",
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                )}
            >
                <img
                    src={`${process.env.PUBLIC_URL}/images/${year}/cars/${activeTeam.constructorId}.png`}
                    alt={`${activeTeam.constructorId} car`}
                    className="drop-shadow-[0_12px_18px_rgba(0,0,0,0.55)] z-20 -mr-40 -mb-16"
                    style={{ width: "200px", maxWidth: "none" }}
                />
                {activeTeam.drivers.map((driverCode) => (
                    <img
                        key={driverCode}
                        src={`${process.env.PUBLIC_URL}/images/${year}/drivers/${driverCode}.png`}
                        alt={`${driverCode} driver`}
                        className="w-[88px] drop-shadow-[0_12px_18px_rgba(0,0,0,0.55)] z-10"
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={navigateToSelectedTeam}
                className={classNames(
                    "rounded px-24 py-16 text-white transition-all duration-200 font-display max-sm:bg-plum-500 bg-glow-dark",
                )}
                style={isHovered ? { boxShadow: `inset 0 0 2.4rem 0 rgba(0, 0, 0, .75), 0 0 2.4rem 0 #${activeTeamColor}` } : undefined}
                title={`Go to ${targetPath}`}
            >
                <div className={classNames('transition-transform duration-300',
                            isHovered
                                ? "scale-95"
                                : "scale-100",
                        )}>Teammate Comparison</div>
            </button>
        </div>
    );
}
