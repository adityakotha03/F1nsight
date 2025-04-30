import React, { useEffect, useState } from "react";
import { fetchAllRaceResults, fetchDriverInfo } from "../../utils/apiF1a";
import { calculateSeriesPoints2025 } from "../../utils/calculateSeriesPoints2025";
import { ConstructorDriver, Loading } from "../../components";

export function DriverStandingsF2({ selectedYear, championshipLevel }) {
    const [standings, setStandings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const allRaceResults = await fetchAllRaceResults(
                selectedYear.toString(),
                championshipLevel
            );
            const driverInfoMap = await fetchDriverInfo(selectedYear, championshipLevel);
            // console.log("👀 driverInfoMap", driverInfoMap);

            // Convert driverInfo array to map by driverId or code
            const driverIdToConstructor = {};
            Object.values(driverInfoMap).forEach((entry) => {
              const driverId = entry.Driver?.driverId;
              const constructorId = entry.Constructor?.constructorId;
              if (driverId && constructorId) {
                driverIdToConstructor[driverId] = constructorId;
              }
            });

            let driverStandings = [];

            const { formattedDrivers } = calculateSeriesPoints2025(
                allRaceResults,
                championshipLevel
            );

            driverStandings = formattedDrivers.map((driver) => ({
                ...driver,
                constructorId: driverIdToConstructor[driver.driverId] || null,
            }));

            setStandings(driverStandings);
            setIsLoading(false);
        };

        fetchData();
    }, [selectedYear]);

    // console.log("DriverStandingsF2", standings);

    return (
        <div className="max-w-[45rem] m-auto mt-64  pb-64">
            {isLoading ? (
                <Loading
                    className="mt-[20rem] mb-[20rem]"
                    message={`Loading ${selectedYear} Driver Standings`}
                />
            ) : (
                <ul>
                    {standings.map((standing, index) => (
                        <li key={index} className="w-full">
                            <ConstructorDriver
                                className="mt-32"
                                image={standing.code}
                                car={standing.constructorId}
                                points={standing.points}
                                firstName={standing.givenName}
                                lastName={standing.familyName}
                                year={selectedYear}
                                showDivider
                                index={index}
                                showStanding
                                championshipLevel={championshipLevel}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
