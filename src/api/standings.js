import teamColors from "../utils/teamColors.json";
import { buildF1nsightApiUrl } from "./client";

export const getPartialConstructorStandings = async (selectedYear, start, end) => {
  const baseURL = buildF1nsightApiUrl(`/races/${selectedYear}`);
  const urls = {
    constructorUrl: `${baseURL}/constructorStandings.json`,
    driverUrl: `${baseURL}/driverStandings.json`
  };

  try {
    const [constructorResponse, driverResponse] = await Promise.all([
      fetch(urls.constructorUrl),
      fetch(urls.driverUrl)
    ]);

    if (!constructorResponse.ok || !driverResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const [constructorData, driverData] = await Promise.all([
      constructorResponse.json(),
      driverResponse.json()
    ]);

    let startStandings = [];
    if (parseInt(start) === 1) {
      startStandings = constructorData[start].map(standing => ({
        constructorName: standing.Constructor.name,
        constructorId: standing.Constructor.constructorId,
        points: 0,
        driverCodes: []
      }));
    } else {
      startStandings = constructorData[start - 1].map(standing => ({
        constructorName: standing.Constructor.name,
        constructorId: standing.Constructor.constructorId,
        points: standing.points,
        driverCodes: []
      }));
    }

    const endStandings = constructorData[end].map(standing => ({
      constructorName: standing.Constructor.name,
      constructorId: standing.Constructor.constructorId,
      points: standing.points,
      driverCodes: []
    }));

    const constructorStandings = startStandings.map(startStanding => {
      const endStanding = endStandings.find(endItem => endItem.constructorId === startStanding.constructorId);
      return {
        constructorName: startStanding.constructorName,
        constructorId: startStanding.constructorId,
        points: (endStanding ? endStanding.points : 0) - startStanding.points,
        driverCodes: startStanding.driverCodes
      };
    });

    const keys = Object.keys(driverData).sort();
    const lastKey = keys[keys.length - 1];
    const driverStandings = driverData[lastKey] || [];

    driverStandings.forEach(standing => {
      standing.Constructors.forEach(constructor => {
        const constructorIndex = constructorStandings.findIndex(c => c.constructorId === constructor.constructorId);
        if (constructorIndex !== -1) {
          constructorStandings[constructorIndex].driverCodes.push(standing.Driver.code);
        }
      });
    });

    constructorStandings.forEach(standing => {
      standing.driverCodes = [...new Set(standing.driverCodes)].sort();
    });

    return constructorStandings.sort((a, b) => parseInt(b.points) - parseInt(a.points));
  } catch (error) {
    console.error("Error fetching constructor standings:", error);
    return [];
  }
};

export const getConstructorStandings = async (selectedYear) => {
  const constructorUrl = buildF1nsightApiUrl(`/races/${selectedYear}/constructorStandings.json`);

  try {
    const constructorResponse = await fetch(constructorUrl);
    if (!constructorResponse.ok) {
      throw new Error("Failed to fetch constructor standings data");
    }
    const constructorData = await constructorResponse.json();

    const raceKeys = Object.keys(constructorData).sort();
    const lastRaceKey = raceKeys[raceKeys.length - 1];
    const dataConstructor = constructorData[lastRaceKey] || [];

    const constructorStandings = dataConstructor.map(standing => ({
      constructorName: standing.Constructor.name,
      constructorId: standing.Constructor.constructorId,
      points: standing.points,
      driverCodes: [],
      constructorColor: teamColors[selectedYear]?.[standing.Constructor.constructorId]
        ? `#${teamColors[selectedYear][standing.Constructor.constructorId]}`
        : "#000000",
    }));

    const driverFetchPromises = constructorStandings.map(async (constructorStanding) => {
      const constructorId = constructorStanding.constructorId;
      const driverUrl = buildF1nsightApiUrl(`/constructors/${selectedYear}/${constructorId}.json`);

      const driverResponse = await fetch(driverUrl);
      if (driverResponse.ok) {
        const drivers = await driverResponse.json();
        constructorStanding.driverCodes = drivers.map(driver => driver.code);
      } else {
        constructorStanding.driverCodes = [];
      }
    });

    await Promise.all(driverFetchPromises);

    constructorStandings.forEach(standing => {
      standing.driverCodes = [...new Set(standing.driverCodes)].sort();
    });

    return constructorStandings;
  } catch (error) {
    console.error("Error fetching constructor standings:", error);
    return [];
  }
};

export const getDriverStandings = async (selectedYear) => {
  const url = buildF1nsightApiUrl(`/races/${selectedYear}/driverStandings.json`);
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const raceKeys = Object.keys(data).sort();
      const lastRaceKey = raceKeys[raceKeys.length - 1];
      const standings = data[lastRaceKey] || [];
      return standings.map(standing => ({
        driverCode: standing.Driver.code,
        firstName: standing.Driver.givenName,
        lastName: standing.Driver.familyName,
        constructorName: standing.Constructors[0].name,
        constructorId: standing.Constructors[0].constructorId,
        points: standing.points,
      }));
    }
  } catch (error) {
    console.error("Error fetching driver standings:", error);
  }
  return [];
};

export const getPartialDriverStandings = async (selectedYear, start, end) => {
  const url = buildF1nsightApiUrl(`/races/${selectedYear}/driverStandings.json`);
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const endStandings = data[end];
      let startStandings = [];
      if (parseInt(start) !== 1) startStandings = data[start - 1];

      const standings = endStandings.map(endStanding => {
        const startStanding = startStandings.find(startItem => startItem.Driver.driverId === endStanding.Driver.driverId);
        return {
          driverCode: endStanding.Driver.code,
          firstName: endStanding.Driver.givenName,
          lastName: endStanding.Driver.lastName,
          constructorName: endStanding.Constructors[0].name,
          constructorId: endStanding.Constructors[0].constructorId,
          points: endStanding.points - (startStanding ? startStanding.points : 0)
        };
      });

      return standings.sort((a, b) => parseInt(b.points) - parseInt(a.points));
    }
  } catch (error) {
    console.error("Error fetching driver standings:", error);
  }
  return [];
};
