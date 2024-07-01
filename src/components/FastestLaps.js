import React from "react";

export const FastestLaps = (props) => {
    const { raceResults, drivers} = props;

    const getTireCompound = (driverCode, lap) => {
        const driver = drivers.find((d) => d.acronym === driverCode);
        if (driver && driver.tires) {
            for (const tire of driver.tires) {
                if (lap <= tire.lap_end) {
                    return tire.compound; // Return the first character of the tire compound
                }
            }
        }
        return "?";
    };

    return (
        <>
        <h3 className="heading-4 mb-16 mt-32 text-neutral-400 ml-24">
            Fastest Laps
        </h3>
        <div className="bg-glow-large h-fit p-32 mb-16 rounded-xlarge">
            <div className="grid grid-cols-4 gap-4 mb-16 text-neutral-400">
                <span className="tracking-xs uppercase">Driver</span>
                <span className="tracking-xs uppercase text-left">Time</span>
                <span className="tracking-xs uppercase text-center">Lap</span>
                <span className="tracking-xs uppercase text-right">Tyre</span>
            </div>
            <div className="divider-glow-medium" />
            <ul>
                {raceResults
                    .filter(
                        (result) => result.FastestLap && result.FastestLap.rank
                    )
                    .sort(
                        (a, b) =>
                            parseInt(a.FastestLap.rank) -
                            parseInt(b.FastestLap.rank)
                    )
                    .map((result, index) => (
                        <React.Fragment key={index}>
                            <li
                                key={index}
                                className="grid grid-cols-4 gap-4 mb-8"
                            >
                                <div>
                                    <span className="font-display">
                                        {result.Driver.code}
                                    </span>
                                    <span className="text-sm ml-8 text-neutral-400 tracking-xs max-sm:hidden">
                                        {result.Constructor.name}
                                    </span>
                                </div>
                                <span className="text-left">
                                    {result.FastestLap.Time.time}
                                </span>
                                <span className="text-center">
                                    {result.FastestLap.lap}
                                </span>
                                <span className="text-right">
                                    {getTireCompound(
                                        result.Driver.code,
                                        result.FastestLap.lap,
                                        drivers
                                    )}
                                </span>
                            </li>
                            <div className="divider-glow-medium" />
                        </React.Fragment>
                    ))}
            </ul>
        </div>
        </>
    );
};
