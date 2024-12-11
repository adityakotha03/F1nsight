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
