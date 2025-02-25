export const fetchRaceMeetingKeysF1a = async (selectedYear) => {
  try {
    const raceResponse = await fetch(`https://ant-dot-comm.github.io/f1aapi/races/races.json`);
    if(!raceResponse.ok) {
      throw new Error('Failed to fetch races');
    }
    const races = await raceResponse.json();
    return races[selectedYear]
  } catch(error) {
    console.error('Error fetching data:', error);
  }
};

export const fetchCircuitData = async () => {
    try {
        const url = `https://ant-dot-comm.github.io/f1aapi/races/racesbyMK.json`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching circuit data:", error);
        return {};
    }
};

export const fetchF1aDriverInfo = async (year) => {
  try {
    const url = `https://ant-dot-comm.github.io/f1aapi/constructors/${year}/drivers.json`;
    const response = await fetch(url);
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
  // console.log('filterTop3', raceData);
  return raceData.sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10)).slice(0, 3);
};

export const fetchF1aRaceResultsByCircuit = async (year, circuitId, top3 = false) => {
  try {
    const url = `https://ant-dot-comm.github.io/f1aapi/races/${year}/resullts.json`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log('fetchF1aRaceResultsByCircuit', circuitId, {data});

    const results = data.find(race => race.Circuit.circuitId === circuitId);
    // console.log('fetchF1aRaceResultsByCircuit', circuitId, {results});
    if (results.length === 0) {
      console.error('No results found for the given circuitId');
      return { raceName: '', race1: [], race2: [], race3: [] };
    }
  
    const driverInfo = await fetchF1aDriverInfo(year);
    
    // Combine results from all races
    // const allRaceResults = results.flatMap(race => [race.Results.race1, race.Results.race2]);
    // console.log({allRaceResults});

    let race1Results = results.Results.race1 ? enrichDriverData(results.Results.race1, driverInfo) : [];
    let race2Results = results.Results.race2 ? enrichDriverData(results.Results.race2, driverInfo) : [];
    let race3Results = results.Results.race3 ? enrichDriverData(results.Results.race3, driverInfo) : [];

    if (top3) {
      race1Results = race1Results ? filterTop3(race1Results) : [];
      race2Results = race2Results ? filterTop3(race2Results) : [];
      race3Results = race3Results ? filterTop3(race3Results) : [];
    }

    return { raceName: results.raceName, race1: race1Results, race2: race2Results, race3: race3Results };

  } catch (error) {
    console.error("Error fetching race results:", error);
    return { raceName: '', race1: [], race2: [], race3: [] };
  }
};

// New function to get all race results for a specific year
export const fetchF1aAllRaceResults = async (year) => {
  try {
    const url = `https://ant-dot-comm.github.io/f1aapi/races/${year}/resullts.json`;
    const response = await fetch(url);
    const data = await response.json();

    // Fetch driver information for enrichment
    const driverInfo = await fetchF1aDriverInfo(year);

    // Map over each race to enrich and structure the results
    const races = data.map(race => {
      let race1Results = race.Results.race1 ? enrichDriverData(race.Results.race1, driverInfo) : [];
      let race2Results = race.Results.race2 ? enrichDriverData(race.Results.race2, driverInfo) : [];
      let race3Results = race.Results.race3 ? enrichDriverData(race.Results.race3, driverInfo) : [];

      return {
        raceName: race.raceName,
        circuitId: race.Circuit.circuitId,
        race1: race1Results,
        race2: race2Results,
        race3: race3Results,
      };
    });

    // console.log('races', races)

    return races;
  } catch (error) {
    console.error("Error fetching all race results:", error);
    return [];
  }
};

export const fetchMostRecentRaceWeekendF1a = async (selectedYear) => {
  try {
    // Step 1: Fetch all races for the selected year
    const raceDetailsResponse = await fetch(`https://ant-dot-comm.github.io/f1aapi/races/${selectedYear}/resullts.json`);
    if (!raceDetailsResponse.ok) {
      throw new Error('Failed to fetch race details');
    }

    const races = await raceDetailsResponse.json();

    
    // Step 2: Sort races based on the `round` to get the most recent one
    const sortedRaces = races.sort((a, b) => parseInt(b.round) - parseInt(a.round)); // Sort in descending order by `round`
    
    const driverInfo = await fetchF1aDriverInfo(selectedYear);
    
    // Step 3: Extract top 3 results for each race (race1, race2, race3, etc.)
    const mostRecentRace = sortedRaces[0]; // Take the first race as the most recent
    // console.log('here', {mostRecentRace})
    const race1Top3 = filterTop3(mostRecentRace.Results.race1 ? enrichDriverData(mostRecentRace.Results.race1, driverInfo) : []);
    const race2Top3 = filterTop3(mostRecentRace.Results.race2 ? enrichDriverData(mostRecentRace.Results.race2, driverInfo) : []);
    const race3Top3 = filterTop3(mostRecentRace.Results.race3 ? enrichDriverData(mostRecentRace.Results.race3, driverInfo) : []);

    // Step 4: Combine the results into one object with all the top 3 results
    return {
      raceName: mostRecentRace.raceName,
      round: mostRecentRace.round,
      season: mostRecentRace.season,
      race1: race1Top3,
      race2: race2Top3,
      race3: race3Top3,
    };

  } catch (error) {
    console.error("Error fetching most recent race weekend data:", error);
    return {
      raceName: '',
      race1: [],
      race2: [],
      race3: [],
    };
  }
};
