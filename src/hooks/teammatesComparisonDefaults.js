import { getConstructorStandings, getDriverStandings } from "../utils/api";

const getNumericPoints = (value) => {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const getParticipationScore = (driver) => {
    return [
        driver.code,
        driver.permanentNumber,
        driver.url,
        driver.dateOfBirth,
        driver.nationality,
    ].filter(Boolean).length;
};

export const getConstructorChampionTeamId = async (year) => {
    const standings = await getConstructorStandings(year);
    const champion = [...standings].sort((a, b) => {
        return getNumericPoints(b.points) - getNumericPoints(a.points);
    })[0];

    return champion?.constructorId || "";
};

export const getRankedMainDrivers = async (year, teamId, drivers) => {
    const driverStandings = await getDriverStandings(year);
    const pointsByDriverId = driverStandings.reduce((acc, standing) => {
        if (standing.constructorId === teamId) {
            acc[standing.driverId] = getNumericPoints(standing.points);
        }

        return acc;
    }, {});

    return drivers
        .filter((driver) => driver.code)
        .map((driver, index) => ({
            ...driver,
            seasonPoints: pointsByDriverId[driver.driverId] || 0,
            participationScore: getParticipationScore(driver),
            originalIndex: index,
        }))
        .sort((a, b) => {
            return (
                b.seasonPoints - a.seasonPoints ||
                b.participationScore - a.participationScore ||
                a.originalIndex - b.originalIndex
            );
        });
};
