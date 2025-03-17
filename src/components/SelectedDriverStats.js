import React from "react";

export const SelectedDriverStats = (props) => {
    const { selectedDriverData, selectedDriverRaceData, year } = props;

    return (
        <div className="mb-32">
            <div className="flex items-end relative w-[23.6rem] mx-auto">
                <img
                    alt=""
                    src={`${
                        process.env.PUBLIC_URL +
                        "/images/" +
                        year +
                        "/drivers/" +
                        selectedDriverData.acronym +
                        ".png"
                    }`}
                    width={120}
                    height={120}
                />
                <img
                    alt=""
                    className="absolute -bottom-16 left-32"
                    src={`${
                        process.env.PUBLIC_URL +
                        "/images/" +
                        year +
                        "/cars/" +
                        selectedDriverRaceData.Constructor.constructorId +
                        ".png"
                    }`}
                    width={150}
                />
                <div className="-ml-32 w-full">
                    <h3 className="tracking-xs text-sm uppercase gradient-text-medium -mb-8">
                        {selectedDriverData.first_name}
                    </h3>
                    <h3 className="font-display gradient-text-light text-[2rem]">
                        {selectedDriverData.last_name}
                    </h3>
                    <p className="font-display gradient-text-dark text-[6.4rem] mr-16 leading-none text-right">
                        {selectedDriverData.driver_number}
                    </p>
                </div>
            </div>
            <div className="bg-glow bg-glow-large px-24 pt-24 pb-24 rounded-xlarge">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="uppercase tracking-xs text-xs">
                            Finshed
                        </div>
                        <div>
                            <span className="font-display text-[3.2rem]">
                                {selectedDriverRaceData.position}
                            </span>
                            <span className="uppercase tracking-xs text-xs ml-4">
                                {selectedDriverRaceData.status === "Finished"
                                    ? selectedDriverRaceData.Time.time
                                    : selectedDriverRaceData.status}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="uppercase tracking-xs text-xs">
                            Started
                        </div>
                        <div className="font-display text-[3.2rem]">
                            {selectedDriverRaceData.grid}
                        </div>
                    </div>
                </div>

                <div className="divider-glow-dark mt-12 mb-10" />

                <p className="font-display text-center mb-14 ml-24">
                    fastest lap
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="uppercase tracking-xs text-xs">
                            Time
                        </div>
                        <div className="font-display">
                            {selectedDriverRaceData.FastestLap.Time.time}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="uppercase tracking-xs text-xs">Lap</div>
                        <div className="font-display">
                            {selectedDriverRaceData.FastestLap.lap}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-16">
                    <div>
                        <div className="uppercase tracking-xs text-xs">
                            avg speed
                        </div>
                        <div>
                            <span className="font-display">
                                {
                                    selectedDriverRaceData.FastestLap
                                        .AverageSpeed.speed
                                }
                            </span>
                            <span className="uppercase tracking-xs text-xs">
                                {
                                    selectedDriverRaceData.FastestLap?.AverageSpeed?.units
                                }
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="uppercase tracking-xs text-xs">
                            Rank
                        </div>
                        <div className="font-display">
                            {selectedDriverRaceData.FastestLap.rank}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
