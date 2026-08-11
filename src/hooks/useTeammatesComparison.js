import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { fetchDriverStats } from "../utils/api";
import { getCurrentYear } from "../utils/currentYear";
import teamColorsByYear from "../utils/teamColors.json";
import {
    getConstructorChampionTeamId,
    getRankedMainDrivers,
} from "./teammatesComparisonDefaults";

const DEFAULT_TEAM_COLOR = "5F0B84";

const normalizeTeamColor = (value) => {
    const color = String(value || DEFAULT_TEAM_COLOR).replace("#", "").trim();
    return color || DEFAULT_TEAM_COLOR;
};

const formatDecimal = (value) => {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? "0.00" : parsed.toFixed(2);
};

const filterDataByYear = (data, year) => ({
    qualifyingTimes: data.driverQualifyingTimes[year] || {},
    racePosition: data.racePosition[year] || {},
    qualiPosition: data.qualiPosition[year] || {},
    finalStandings: data.finalStandings[year] || {},
    seasonPodiums: data.seasonPodiums[year] || 0,
    seasonPoles: data.seasonPoles[year] || 0,
    seasonWins: data.seasonWins[year] || 0,
    lastUpdate: data.lastUpdate,
    positionsGainLost: data.positionsGainLost[year] || {},
    avgRacePositions: data.avgRacePositions[year] || {},
    avgQualiPositions: data.avgQualiPositions[year] || {},
    win_rates: data.rates.wins[year] || {},
    podium_rates: data.rates.podiums[year] || {},
    pole_rates: data.rates.poles[year] || {},
    seasonDNFs: data.seasonDNFs[year] || 0,
});

const processQualifyingResults = (qualifyingResults) => {
    if (!qualifyingResults) return { qualifyingTimes: [] };

    const qualifyingTimes = Object.entries(qualifyingResults.QualiTimes).map(
        ([raceName, times]) => ({
            race: raceName,
            QualiTimes: [times[0] || "N/A", times[1] || "N/A", times[2] || "N/A"],
        })
    );

    return { qualifyingTimes };
};

const processPositions = (positions) => {
    if (!positions) return { pos: [] };

    return {
        pos: Object.entries(positions.positions).map(([raceName, pos]) => ({
            raceName,
            pos: parseInt(pos, 10),
        })),
    };
};

const getCommonPositionLists = (driver1Positions = {}, driver2Positions = {}) => {
    const commonRaces = Object.keys(driver1Positions).filter(
        (race) => race in driver2Positions
    );

    return {
        driver1: commonRaces.reduce((result, race) => {
            result[race] = driver1Positions[race];
            return result;
        }, {}),
        driver2: commonRaces.reduce((result, race) => {
            result[race] = driver2Positions[race];
            return result;
        }, {}),
    };
};

const buildHeadToHeadData = (driverResults, driver1Id, driver2Id, drivers) => {
    const driver1 = drivers.find((driver) => driver.driverId === driver1Id);
    const driver2 = drivers.find((driver) => driver.driverId === driver2Id);

    if (!driver1 || !driver2) {
        return { headToHeadData: null, ambQ: true, ambR: true };
    }

    let driver1QualifyingWins = 0;
    let driver2QualifyingWins = 0;
    let driver1RaceWins = 0;
    let driver2RaceWins = 0;
    let ambQ = true;
    let ambR = true;

    const { qualifyingTimes: driver1QualifyingTimesProcessed } =
        processQualifyingResults(driverResults[driver1Id]?.qualifyingTimes);
    const { qualifyingTimes: driver2QualifyingTimesProcessed } =
        processQualifyingResults(driverResults[driver2Id]?.qualifyingTimes);

    const { pos: driver1QualifyingPos } = processPositions(
        driverResults[driver1Id]?.qualiPosition
    );
    const { pos: driver2QualifyingPos } = processPositions(
        driverResults[driver2Id]?.qualiPosition
    );

    driver1QualifyingPos.forEach((race1) => {
        const race2 = driver2QualifyingPos.find(
            (item) => item.raceName === race1.raceName
        );
        if (race2) {
            ambQ = false;
            if (race1.pos < race2.pos) driver1QualifyingWins += 1;
            if (race2.pos < race1.pos) driver2QualifyingWins += 1;
        }
    });

    const { pos: driver1RacePosProcessed } = processPositions(
        driverResults[driver1Id]?.racePosition
    );
    const { pos: driver2RacePosProcessed } = processPositions(
        driverResults[driver2Id]?.racePosition
    );

    driver1RacePosProcessed.forEach((race1) => {
        const race2 = driver2RacePosProcessed.find(
            (item) => item.raceName === race1.raceName
        );
        if (race2) {
            ambR = false;
            if (race1.pos < race2.pos) driver1RaceWins += 1;
            if (race2.pos < race1.pos) driver2RaceWins += 1;
        }
    });

    const qualifyingPositions = getCommonPositionLists(
        driverResults[driver1Id]?.qualiPosition.positions,
        driverResults[driver2Id]?.qualiPosition.positions
    );
    const racePositions = getCommonPositionLists(
        driverResults[driver1Id]?.racePosition.positions,
        driverResults[driver2Id]?.racePosition.positions
    );

    return {
        ambQ,
        ambR,
        headToHeadData: {
            lastUpdate: driverResults[driver1Id]?.lastUpdate,
            driver1: `${driver1.givenName} ${driver1.familyName}`,
            driver2: `${driver2.givenName} ${driver2.familyName}`,
            driver1Id: driver1.driverId,
            driver2Id: driver2.driverId,
            driver1Code: driver1.code,
            driver2Code: driver2.code,
            driver1QualifyingWins,
            driver2QualifyingWins,
            driver1RaceWins,
            driver2RaceWins,
            driver1Points: parseInt(
                driverResults[driver1Id]?.finalStandings.points || "0",
                10
            ),
            driver2Points: parseInt(
                driverResults[driver2Id]?.finalStandings.points || "0",
                10
            ),
            driver1Podiums: driverResults[driver1Id]?.seasonPodiums || 0,
            driver2Podiums: driverResults[driver2Id]?.seasonPodiums || 0,
            driver1Poles: driverResults[driver1Id]?.seasonPoles || 0,
            driver2Poles: driverResults[driver2Id]?.seasonPoles || 0,
            driver1QualifyingTimes: driver1QualifyingTimesProcessed,
            driver2QualifyingTimes: driver2QualifyingTimesProcessed,
            driver1QualifyingPosList: qualifyingPositions.driver1,
            driver2QualifyingPosList: qualifyingPositions.driver2,
            driver1RacePosList: racePositions.driver1,
            driver2RacePosList: racePositions.driver2,
            driver1AvgRacePosition: formatDecimal(
                driverResults[driver1Id]?.avgRacePositions
            ),
            driver2AvgRacePosition: formatDecimal(
                driverResults[driver2Id]?.avgRacePositions
            ),
            driver1AvgQualiPositions: formatDecimal(
                driverResults[driver1Id]?.avgQualiPositions
            ),
            driver2AvgQualiPositions: formatDecimal(
                driverResults[driver2Id]?.avgQualiPositions
            ),
            driver1_win_rates: formatDecimal(driverResults[driver1Id]?.win_rates),
            driver2_win_rates: formatDecimal(driverResults[driver2Id]?.win_rates),
            driver1_podium_rates: formatDecimal(
                driverResults[driver1Id]?.podium_rates
            ),
            driver2_podium_rates: formatDecimal(
                driverResults[driver2Id]?.podium_rates
            ),
            driver1_pole_rates: formatDecimal(driverResults[driver1Id]?.pole_rates),
            driver2_pole_rates: formatDecimal(driverResults[driver2Id]?.pole_rates),
            driver1PositionsGainLost: driverResults[driver1Id]?.positionsGainLost || {},
            driver2PositionsGainLost: driverResults[driver2Id]?.positionsGainLost || {},
            driver1DNF: driverResults[driver1Id]?.seasonDNFs || 0,
            driver2DNF: driverResults[driver2Id]?.seasonDNFs || 0,
            driver1Wins: driverResults[driver1Id]?.seasonWins || 0,
            driver2Wins: driverResults[driver2Id]?.seasonWins || 0,
        },
    };
};

export const useTeammatesComparison = () => {
    const currentYear = getCurrentYear();
    const years = useMemo(
        () => Array.from({ length: currentYear - 1975 + 1 }, (_, i) => currentYear - i),
        [currentYear]
    );
    const { urlYear, urlTeam } = useParams();
    const navigate = useNavigate();

    const [year, setYear] = useState("");
    const [team, setTeam] = useState("");
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver1, setSelectedDriver1] = useState("");
    const [selectedDriver2, setSelectedDriver2] = useState("");
    const [headToHeadData, setHeadToHeadData] = useState(null);
    const [showDriverSelectors, setShowDriverSelectors] = useState(false);
    const [teamCache, setTeamCache] = useState({});
    const [ambQ, setAmbQ] = useState(true);
    const [ambR, setAmbR] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [teamColor, setTeamColor] = useState(DEFAULT_TEAM_COLOR);
    const [renderHead, setRenderHead] = useState(true);
    const [showTimes, setShowTimes] = useState(true);
    const teamsMemo = useMemo(() => teamCache[year] || [], [year, teamCache]);

    useEffect(() => {
        const validYear =
            urlYear && parseInt(urlYear, 10) <= currentYear ? urlYear : currentYear;
        setYear(validYear);
        setTeam(urlTeam || "");
    }, [urlYear, urlTeam, currentYear]);

    const fetchDriverData = useCallback(
        async (selectedDrivers) => {
            if (selectedDrivers.length < 2) return;

            setIsLoading(true);
            try {
                const driverIds = selectedDrivers.map((driver) => driver.driverId);
                const driverResults = await fetchDriverStats(driverIds[0], driverIds[1]);
                const driverResultsMap = {
                    [driverResults.driver1.driverId]: filterDataByYear(
                        driverResults.driver1,
                        year
                    ),
                    [driverResults.driver2.driverId]: filterDataByYear(
                        driverResults.driver2,
                        year
                    ),
                };
                const nextComparison = buildHeadToHeadData(
                    driverResultsMap,
                    selectedDrivers[0].driverId,
                    selectedDrivers[1].driverId,
                    selectedDrivers
                );

                setAmbQ(nextComparison.ambQ);
                setAmbR(nextComparison.ambR);
                setHeadToHeadData(nextComparison.headToHeadData);
                setRenderHead(true);
            } catch (error) {
                console.error("Error fetching driver data:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [year]
    );

    const submit = useCallback(
        async (selectedTeam) => {
            if (!year || !selectedTeam) return;

            try {
                const response = await axios.get(
                    `https://praneeth7781.github.io/f1nsight-api-2/constructors/${year}/${selectedTeam}.json`
                );
                const fetchedDrivers = response.data;
                const rankedMainDrivers = await getRankedMainDrivers(
                    year,
                    selectedTeam,
                    fetchedDrivers
                );
                const defaultDrivers = rankedMainDrivers.slice(0, 2);

                setDrivers(rankedMainDrivers);

                setTeamColor(
                    normalizeTeamColor(teamColorsByYear[year]?.[selectedTeam])
                );

                if (defaultDrivers.length >= 2) {
                    setSelectedDriver1(defaultDrivers[0].driverId);
                    setSelectedDriver2(defaultDrivers[1].driverId);
                    setShowDriverSelectors(rankedMainDrivers.length > 2);
                    await fetchDriverData(defaultDrivers);
                } else {
                    setSelectedDriver1("");
                    setSelectedDriver2("");
                    setShowDriverSelectors(false);
                    setRenderHead(false);
                }
            } catch (error) {
                console.error("Error submitting team data:", error);
            }
        },
        [fetchDriverData, year]
    );

    const fetchTeams = useCallback(async () => {
        if (!year || teamCache[year]) return;

        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://praneeth7781.github.io/f1nsight-api-2/constructors/${year}.json`
            );
            const constructors = response.data;
            setTeamCache((prevCache) => ({ ...prevCache, [year]: constructors }));

            if (
                team &&
                !constructors.some((constructor) => constructor.constructorId === team)
            ) {
                window.alert(`${team} did not participate in ${year}`);
                setTeam("");
                navigate(`/teammates-comparison/${year}`, { replace: true });
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, team, teamCache, year]);

    useEffect(() => {
        let isActive = true;

        const defaultToConstructorChampion = async () => {
            if (!year || team || !teamsMemo.length) return;

            const championTeamId = await getConstructorChampionTeamId(year);
            if (!isActive || !championTeamId) return;

            setTeam(championTeamId);
            navigate(`/teammates-comparison/${year}/${championTeamId}`, {
                replace: true,
            });
        };

        defaultToConstructorChampion();

        return () => {
            isActive = false;
        };
    }, [navigate, team, teamsMemo.length, year]);

    useEffect(() => {
        if (year) {
            fetchTeams();
            if (team) {
                submit(team);
            }
        }
    }, [fetchTeams, submit, team, year]);

    const handleYearChange = (selectedOption) => {
        const selectedYear = selectedOption.value;
        setYear(selectedYear);
        setTeam("");
        setDrivers([]);
        setHeadToHeadData(null);
        navigate(`/teammates-comparison/${selectedYear}`, { replace: true });
    };

    const handleTeamChange = (selectedOption) => {
        const selectedTeam = selectedOption.value;
        setTeam(selectedTeam);
        navigate(`/teammates-comparison/${year}/${selectedTeam}`, { replace: true });
        submit(selectedTeam);
    };

    const handleDriver1Change = async (selectedOption) => {
        setSelectedDriver1(selectedOption.value);
        if (selectedDriver2) {
            setAmbQ(true);
            setAmbR(true);
            const driver1Data = drivers.find(
                (driver) => driver.driverId === selectedOption.value
            );
            const driver2Data = drivers.find(
                (driver) => driver.driverId === selectedDriver2
            );
            await fetchDriverData([driver1Data, driver2Data].filter(Boolean));
        }
    };

    const handleDriver2Change = async (selectedOption) => {
        setSelectedDriver2(selectedOption.value);
        if (selectedDriver1) {
            setAmbQ(true);
            setAmbR(true);
            const driver1Data = drivers.find(
                (driver) => driver.driverId === selectedDriver1
            );
            const driver2Data = drivers.find(
                (driver) => driver.driverId === selectedOption.value
            );
            await fetchDriverData([driver1Data, driver2Data].filter(Boolean));
        }
    };

    const handleSwapDrivers = async () => {
        const nextDriver1 = selectedDriver2;
        const nextDriver2 = selectedDriver1;
        setSelectedDriver1(nextDriver1);
        setSelectedDriver2(nextDriver2);

        if (nextDriver1 && nextDriver2) {
            const driver1Data = drivers.find((driver) => driver.driverId === nextDriver1);
            const driver2Data = drivers.find((driver) => driver.driverId === nextDriver2);
            await fetchDriverData([driver1Data, driver2Data].filter(Boolean));
        }
    };

    const yearOptions = useMemo(
        () => years.map((yearOption) => ({ value: yearOption, label: yearOption })),
        [years]
    );
    const teamOptions = useMemo(
        () =>
            teamsMemo.map((teamOption) => ({
                value: teamOption.constructorId,
                label: teamOption.name,
            })),
        [teamsMemo]
    );
    const driverOptions = useMemo(
        () =>
            drivers.map((driver) => ({
                value: driver.driverId,
                label: `${driver.givenName} ${driver.familyName}`,
            })),
        [drivers]
    );
    const selectedTeamName =
        teamsMemo.find((teamOption) => teamOption.constructorId === team)?.name || team;

    return {
        ambQ,
        ambR,
        currentYear,
        driverOptions,
        drivers,
        handleDriver1Change,
        handleDriver2Change,
        handleShowDifference: () => setShowTimes(false),
        handleShowTimes: () => setShowTimes(true),
        handleSwapDrivers,
        handleTeamChange,
        handleYearChange,
        headToHeadData,
        isLoading,
        renderHead,
        selectedDriver1,
        selectedDriver2,
        selectedTeamName,
        showDriverSelectors,
        showTimes,
        team,
        teamColor,
        teamOptions,
        year,
        yearOptions,
    };
};
