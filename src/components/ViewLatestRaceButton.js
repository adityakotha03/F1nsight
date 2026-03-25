import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { trackButtonClick } from "../utils/gaTracking";

export function ViewLatestRaceButton({
    meetingKey,
    driverCodes = [],
    year,
    className,
}) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const displayDriverCodes = useMemo(
        () => driverCodes.filter(Boolean).slice(0, 3),
        [driverCodes]
    );
    const positionedDriverCodes = useMemo(() => {
        const [winner, second, third] = displayDriverCodes;
        return [
            { code: second, slot: "left" },
            { code: winner, slot: "center" },
            { code: third, slot: "right" },
        ].filter((item) => item.code);
    }, [displayDriverCodes]);

    const targetPath = meetingKey ? `/race/${meetingKey}` : "";

    const navigateToLatestRace = () => {
        if (!meetingKey) return;
        navigate(targetPath);
        trackButtonClick(`Home/Click/F1/View Full Results - ${targetPath}`);
    };

    return (
        <div
            className={classNames("relative inline-flex items-end", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full flex items-end justify-center -space-x-40 z-20">
                {positionedDriverCodes.map(({ code, slot }) => (
                    <img
                        key={code}
                        src={`${process.env.PUBLIC_URL}/images/${year}/drivers/${code}.png`}
                        alt={`${code} driver`}
                        className={classNames(
                            "drop-shadow-[0_12px_18px_rgba(0,0,0,0.55)] transition-all duration-300 ease-out",
                            slot === "center" ? "z-30 w-[104px]" : "z-20 w-[82px]",
                            isHovered
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-16"
                        )}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={navigateToLatestRace}
                disabled={!meetingKey}
                className={classNames(
                    "rounded px-24 py-16 text-white transition-all duration-200 font-display",
                    meetingKey ? "max-sm:bg-plum-500 bg-glow-dark" : "bg-glow-dark/60 cursor-not-allowed",
                )}
                style={isHovered ? { boxShadow: `inset 0 0 2.4rem 0 rgba(0, 0, 0, .75), 0 0 2.4rem 0 #ffffff` } : undefined}
            >
                <div className={classNames('transition-transform duration-300',
                            isHovered
                                ? "scale-95"
                                : "scale-100",
                        )}>View Latest Race</div>
            </button>
        </div>
    );
}
