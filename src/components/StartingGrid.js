import classNames from "classnames";
import React from "react";
import { wildCardDrivers } from "../utils/wildCards";

export const StartingGrid = (props) => {
    const {
        raceResults,
        startingGrid,
        year,
        driverCode,
        driversDetails,
        driversColor,
        className,
    } = props;

    return (
        <div className={classNames(className, "bg-glow-large py-32 h-fit rounded-md sm:rounded-xlarge")}>
            <ul className="flex flex-col w-fit m-auto">
                {startingGrid
                    .sort((a, b) => a.position - b.position)
                    .map((gridPosition, index) => {
                        // Create a lookup map for the constructors
                        const constructorMap = raceResults.reduce(
                            (acc, result) => {
                                acc[result.Driver.code] =
                                    result.Constructor.constructorId;
                                return acc;
                            },
                            {}
                        );

                        const getCarTopView = (driver) => {
                            return constructorMap[driver];
                        };

                        return (
                            <li
                                key={index}
                                className="text-center w-fit even:-mt-[8rem] even:ml-[6rem] even:mb-8 relative group"
                            >
                                <div
                                    className={classNames(
                                        "border-x-2 border-t-2 border-solid w-48 font-display h-32 ml-4",
                                        driverCode ===
                                            driversDetails[
                                                gridPosition.driver_number
                                            ]
                                            ? `border-neutral-[#${driversColor[driverCode]}]`
                                            : " border-neutral-700"
                                    )}
                                />

                                <img
                                    alt=""
                                    className="-mt-32 drop-shadow-[0_0_14px_rgba(0,0,0,0.75)]"
                                    src={
                                        year > 2023
                                            ? `${
                                                    process.env.PUBLIC_URL +
                                                    "/images/" +
                                                    year +
                                                    "/carTopView/" +
                                                    getCarTopView(
                                                        driversDetails[
                                                            gridPosition
                                                                .driver_number
                                                        ]
                                                    ) +
                                                    ".png"
                                                }`
                                            : `${
                                                    process.env.PUBLIC_URL +
                                                    "/images/f1nsight-topview.png"
                                                }`
                                    }
                                    width={56}
                                />

                                <div
                                    className={classNames(
                                        "font-display leading-none text-18",
                                        "absolute top-1/2 -translate-y-1/2",
                                        "flex flex-col",
                                        "group-odd:right-[90%] group-even:left-[90%]",
                                        "group-odd:items-end group-even:items-start"
                                    )}
                                >
                                    <p className="text-neutral-500">
                                        P{gridPosition.position}
                                    </p>
                                    <p
                                        style={{
                                            color:
                                                driverCode ===
                                                driversDetails[
                                                    gridPosition
                                                        .driver_number
                                                ]
                                                    ? `#${driversColor[driverCode]}`
                                                    : driverCode
                                                    ? "text-neutral-400"
                                                    : "#f1f1f1",
                                        }}
                                    >
                                        {
                                            driversDetails[
                                                gridPosition.driver_number
                                            ]
                                        }
                                    </p>
                                </div>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export const StartingGridF1A = (props) => {
    const { raceResults, year } = props;

     // Function to create an array of driver codes in the order of grid positions 1-16
     const getDriverCodesByGridPosition = (results) => {
        // Sort results by grid position
        const sortedResults = results.sort((a, b) => parseInt(a.grid) - parseInt(b.grid));
        // Initialize an array to store driver codes
        const driverCodes = [];
        // Iterate over sorted results and extract driver code
        for (let i = 0; i < sortedResults.length; i++) {
            if (sortedResults[i]) { // Check if result exists for this grid position
                driverCodes.push(sortedResults[i].Driver.code);
            } else {
                driverCodes.push(""); // Push empty string if no driver for this position
            }
        }
        return driverCodes;
    };
    const sortedStartingGrid = getDriverCodesByGridPosition(raceResults);

    return (
        <>
            <h3 className="heading-4 mb-16 text-neutral-400 ml-24">
                Starting Grid
            </h3>
            <div className="bg-glow-large p-32 h-fit rounded-xlarge min-w-[22.4rem]">
              <ul className="flex flex-col w-fit m-auto">
                {sortedStartingGrid.map((driverCode, index) => (
                      <li className="text-center w-fit even:-mt-[8rem] even:ml-[6rem] even:mb-8 relative group">
                          <div
                              className={classNames(
                                  "border-x-2 border-t-2 border-solid border-neutral-700 w-48 font-display h-32 ml-4"
                              )}
                          />

                          <img
                              alt=""
                              className="-mt-32 drop-shadow-[0_0_14px_rgba(0,0,0,0.75)]"
                              src={wildCardDrivers[year].includes(driverCode) ? 
                                `${ process.env.PUBLIC_URL + "/images/2024/F1A/carTopView/wildcard-top.png"}` :
                                `${ process.env.PUBLIC_URL + "/images/" + year + "/F1A/carTopView/" + driverCode + "-top.png"}` 
                              }
                              width={56}
                          />

                          <div
                              className={classNames(
                                  "font-display leading-none text-18",
                                  "absolute top-1/2 -translate-y-1/2",
                                  "flex flex-col",
                                  "group-odd:right-[90%] group-even:left-[90%]",
                                  "group-odd:items-end group-even:items-start"
                              )}
                          >
                              <p className="text-neutral-500">P{index+1}</p>
                              <p>
                                  {driverCode}
                              </p>
                          </div>
                      </li>
                ))}
              </ul>
            </div>
        </>
    );
};
