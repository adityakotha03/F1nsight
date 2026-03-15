import classNames from "classnames";
import React, { useState } from "react";

const DriverCarDetails = ({ driverDetails }) => {
    const [unit, setUnit] = useState("km/h");


    const drsActiveNumbers = [10, 12, 14];
    const handleUnitChange = (newUnit) => {
        if (newUnit === "mph" && unit !== "mph") {
            setUnit("mph");
        } else if (newUnit === "km/h" && unit !== "km/h") {
            setUnit("km/h");
        }
    };

    return (
        <div className="px-16 py-10 shadow-xl bg-neutral-800/90 backdrop-blur-sm rounded-l-md">
            <div className="flex flex-col">
                <p className="gradient-text-light uppercase text-[1rem] tracking-sm leading-none">
                    Gear
                </p>
                <div className="flex items-center justify-between">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <p
                            key={number}
                            className={classNames(
                                "font-display ease-in-out leading-none text-sm",
                                driverDetails.n_gear === number
                                    ? "text-xl"
                                    : "text-neutral-400"
                            )}
                        >
                            {number}
                        </p>
                    ))}
                </div>
            </div>

            <div className="divider-glow-dark my-6 !h-8" />

            <div className="flex gap-32">
                <div className="flex flex-col w-[10rem] sm:w-[20rem]">
                    <p className="font-display max-sm:text-[2.4rem] sm:text-[6.4rem] leading-none">
                        {unit === "km/h"
                            ? driverDetails.speed
                            : Math.round(driverDetails.speed * 0.621371)}
                    </p>
                    <div className="flex gap-16 uppercase text-[1rem] tracking-xs">
                        <button
                            className={`${
                                unit === "km/h" ? "" : "gradient-text-light"
                            }`}
                            onClick={() => handleUnitChange("km/h")}
                        >
                            km/h
                        </button>
                        /
                        <button
                            className={`${
                                unit === "mph" ? "" : "gradient-text-light"
                            }`}
                            onClick={() => handleUnitChange("mph")}
                        >
                            mph
                        </button>
                    </div>
                    <p
                        className={classNames(
                            "max-sm:text-[1rem] border-solid px-16 mt-8 text-center",
                            drsActiveNumbers.includes(driverDetails.drs)
                                ? "bg-emerald-900 text-emerald-500"
                                : "bg-neutral-900 text-neutral-700"
                        )}
                    >
                        DRS Enabled
                    </p>
                </div>
            </div>

            <div className="divider-glow-dark !h-8 mt-8 mb-4" />

            <div className="flex flex-col">
                <p className="gradient-text-light uppercase text-[1rem] tracking-sm">Throttle</p>
                <div className="shadow-lg bg-emerald-950">
                    <div
                        className="bg-gradient-to-r from-emerald-700 to-emerald-400 h-12 ease-in-out"
                        style={{
                            width: `${driverDetails.throttle}%`,
                        }}
                    />
                </div>
                <div className="shadow-lg bg-rose-950">
                    <div
                        className="bg-gradient-to-r from-rose-900 to-rose-600 h-12 ease-in-out"
                        style={{
                            width: `${driverDetails.brake}%`,
                        }}
                    />
                </div>
                <p className="gradient-text-light uppercase text-[1rem] tracking-sm">Brake</p>
            </div>
        </div>
    );
};

export default DriverCarDetails;
