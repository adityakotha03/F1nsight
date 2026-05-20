const getSeriesApiBaseUrl = (championshipLevel) => {
  if (championshipLevel === "F1A") return "https://ant-dot-comm.github.io/f1aapi";
  if (championshipLevel === "F2") return "https://ant-dot-comm.github.io/f2api";
  return "";
};

export const fetchRaceMeetingKeysF1a = async (selectedYear, championshipLevel) => {
  try {
    const response = await fetch(`${getSeriesApiBaseUrl(championshipLevel)}/races/races.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch races");
    }
    const races = await response.json();
    return races[selectedYear];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchCircuitData = async (championshipLevel) => {
  try {
    const response = await fetch(`${getSeriesApiBaseUrl(championshipLevel)}/races/racesbyMK.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching circuit data:", error);
    return {};
  }
};

export const fetchDriverInfo = async (year, championshipLevel) => {
  try {
    const path = championshipLevel === "F1A"
      ? `/constructors/${year}/drivers.json`
      : `/drivers/${year}/drivers.json`;
    const response = await fetch(`${getSeriesApiBaseUrl(championshipLevel)}${path}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching driver information:", error);
    return {};
  }
};

const enrichDriverData = (raceData, driverInfo) => {
  return raceData.map(driver => {
    const driverDetails = driverInfo[driver.number];
    if (!driverDetails || !driverDetails.Driver || !driverDetails.Constructor) {
      console.error("enrichDriverData missing driver details", {
        driverNumber: driver.number,
        driverDetails,
        availableDrivers: Object.keys(driverInfo || {}),
      });
      return driver;
    }
    return {
      ...driver,
      Driver: {
        ...driverDetails.Driver
      },
      Constructor: {
        ...driverDetails.Constructor
      }
    };
  });
};

const filterTop3 = (raceData) => {
  return raceData.sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)).slice(0, 3);
};

export const fetchRaceResultsByCircuit = async (year, circuitId, top3 = false, championshipLevel) => {
  try {
    const response = await fetch(`${getSeriesApiBaseUrl(championshipLevel)}/races/${year}/resullts.json`);
    const data = await response.json();
    const results = data.find(race => race.Circuit.circuitId === circuitId);

    if (!results) {
      console.error(`No race found for circuitId: ${circuitId}`);
      return { raceName: "", race0: [], race1: [], race2: [], race3: [] };
    }

    const driverInfo = await fetchDriverInfo(year, championshipLevel);

    let race0Results = results.Results.race0 ? enrichDriverData(results.Results.race0, driverInfo) : [];
    let race1Results = results.Results.race1 ? enrichDriverData(results.Results.race1, driverInfo) : [];
    let race2Results = results.Results.race2 ? enrichDriverData(results.Results.race2, driverInfo) : [];
    let race3Results = results.Results.race3 ? enrichDriverData(results.Results.race3, driverInfo) : [];

    if (top3) {
      race0Results = race0Results ? filterTop3(race0Results) : [];
      race1Results = race1Results ? filterTop3(race1Results) : [];
      race2Results = race2Results ? filterTop3(race2Results) : [];
      race3Results = race3Results ? filterTop3(race3Results) : [];
    }

    return { raceName: results.raceName, race0: race0Results, race1: race1Results, race2: race2Results, race3: race3Results };
  } catch (error) {
    console.error("Error fetching race results:", error);
    return { raceName: "", race0: [], race1: [], race2: [], race3: [] };
  }
};

export const fetchAllRaceResults = async (year, championshipLevel) => {
  try {
    const response = await fetch(`${getSeriesApiBaseUrl(championshipLevel)}/races/${year}/resullts.json`);
    const data = await response.json();
    const driverInfo = await fetchDriverInfo(year, championshipLevel);

    return data.map(race => {
      const race0Results = race.Results.race0 ? enrichDriverData(race.Results.race0, driverInfo) : [];
      const race1Results = race.Results.race1 ? enrichDriverData(race.Results.race1, driverInfo) : [];
      const race2Results = race.Results.race2 ? enrichDriverData(race.Results.race2, driverInfo) : [];
      const race3Results = race.Results.race0 ? enrichDriverData(race.Results.race0, driverInfo) : [];

      return {
        raceName: race.raceName,
        circuitId: race.Circuit.circuitId,
        race0: race0Results,
        race1: race1Results,
        race2: race2Results,
        race3: race3Results,
      };
    });
  } catch (error) {
    console.error("Error fetching all race results:", error);
    return [];
  }
};

export const fetchMostRecentRaceWeekend = async (selectedYear, championshipLevel) => {
  try {
    const response = await fetch(`${getSeriesApiBaseUrl(championshipLevel)}/races/${selectedYear}/resullts.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch race details");
    }

    const races = await response.json();
    const sortedRaces = races.sort((a, b) => parseInt(b.round) - parseInt(a.round));
    const driverInfo = await fetchDriverInfo(selectedYear, championshipLevel);
    const mostRecentRace = sortedRaces[0];

    return {
      raceName: mostRecentRace.raceName,
      round: mostRecentRace.round,
      season: mostRecentRace.season,
      race0: filterTop3(mostRecentRace.Results.race0 ? enrichDriverData(mostRecentRace.Results.race0, driverInfo) : []),
      race1: filterTop3(mostRecentRace.Results.race1 ? enrichDriverData(mostRecentRace.Results.race1, driverInfo) : []),
      race2: filterTop3(mostRecentRace.Results.race2 ? enrichDriverData(mostRecentRace.Results.race2, driverInfo) : []),
      race3: filterTop3(mostRecentRace.Results.race3 ? enrichDriverData(mostRecentRace.Results.race3, driverInfo) : []),
    };
  } catch (error) {
    console.error("Error fetching most recent race weekend data:", error);
    return {
      raceName: "",
      race0: [],
      race1: [],
      race2: [],
      race3: [],
    };
  }
};
