import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchDriverStats, fetchDriversList, fetchRaceDetails } from "../utils/api";

const DEFAULT_DRIVER_1 = "max_verstappen";
const DEFAULT_DRIVER_2 = "hamilton";

export const useDriverComparison = () => {
    const { urlDriver1, urlDriver2 } = useParams();
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const [driver1Id, setDriver1Id] = useState(urlDriver1 || "");
    const [driver2Id, setDriver2Id] = useState(urlDriver2 || "");
    const [driver1Data, setDriver1Data] = useState(null);
    const [driver2Data, setDriver2Data] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [raceNamesByYear, setRaceNamesByYear] = useState({});

    useEffect(() => {
        let isCurrent = true;

        const loadDrivers = async () => {
            try {
                const response = await fetchDriversList();
                if (!isCurrent) return;

                const sortedDrivers = [...response].sort((a, b) => a.name.localeCompare(b.name));
                const ids = new Set(sortedDrivers.map(({ id }) => id));
                const nextDriver1 = ids.has(urlDriver1)
                    ? urlDriver1
                    : ids.has(DEFAULT_DRIVER_1) ? DEFAULT_DRIVER_1 : sortedDrivers[0]?.id;
                const nextDriver2 = ids.has(urlDriver2)
                    ? urlDriver2
                    : ids.has(DEFAULT_DRIVER_2) ? DEFAULT_DRIVER_2 : sortedDrivers[1]?.id;

                setDrivers(sortedDrivers);
                setDriver1Id(nextDriver1 || "");
                setDriver2Id(nextDriver2 || "");
            } catch (loadError) {
                if (isCurrent) setError("The driver archive could not be opened.");
            }
        };

        loadDrivers();
        return () => { isCurrent = false; };
    }, [urlDriver1, urlDriver2]);

    useEffect(() => {
        if (!driver1Id || !driver2Id) return undefined;
        let isCurrent = true;

        const loadComparison = async () => {
            setIsLoading(true);
            setError("");
            setDriver1Data(null);
            setDriver2Data(null);
            try {
                const response = await fetchDriverStats(driver1Id, driver2Id);
                if (!response.driver1 || !response.driver2) {
                    throw new Error("Missing driver comparison data");
                }
                if (!isCurrent) return;
                setDriver1Data(response.driver1);
                setDriver2Data(response.driver2);
            } catch (loadError) {
                if (!isCurrent) return;
                setDriver1Data(null);
                setDriver2Data(null);
                setError("This comparison file is not available yet.");
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        loadComparison();
        return () => { isCurrent = false; };
    }, [driver1Id, driver2Id]);

    const driver1 = drivers.find(({ id }) => id === driver1Id);
    const driver2 = drivers.find(({ id }) => id === driver2Id);
    const allYears = useMemo(() => {
        const firstYears = Object.keys(driver1Data?.finalStandings || {});
        const secondYears = Object.keys(driver2Data?.finalStandings || {});
        return [...new Set([...firstYears, ...secondYears])].sort();
    }, [driver1Data, driver2Data]);
    const sharedYears = useMemo(() => allYears.filter(
        year => driver1Data?.finalStandings?.[year] && driver2Data?.finalStandings?.[year]
    ), [allYears, driver1Data, driver2Data]);

    useEffect(() => {
        let isCurrent = true;

        const loadRaceNames = async () => {
            const entries = await Promise.all(sharedYears.map(async year => {
                const races = await fetchRaceDetails(year);
                return [year, races.map(race => race.raceName)];
            }));
            if (isCurrent) setRaceNamesByYear(Object.fromEntries(entries));
        };

        if (sharedYears.length) loadRaceNames();
        else setRaceNamesByYear({});

        return () => { isCurrent = false; };
    }, [sharedYears]);

    const selectComparison = (nextDriver1, nextDriver2) => {
        if (!nextDriver1 || !nextDriver2 || nextDriver1 === nextDriver2) return;
        navigate(`/driver-comparison/${encodeURIComponent(nextDriver1)}/${encodeURIComponent(nextDriver2)}`);
        setDriver1Id(nextDriver1);
        setDriver2Id(nextDriver2);
    };

    return {
        allYears,
        driver1,
        driver1Data,
        driver1Id,
        driver2,
        driver2Data,
        driver2Id,
        drivers,
        error,
        isLoading,
        raceNamesByYear,
        selectComparison,
        sharedYears,
    };
};
