  export const fetchRaceDetails = async (selectedYear) => {
    const url = `https://ergast.com/api/f1/${selectedYear}.json`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const races = data.MRData.RaceTable.Races;
  
        const raceResultsPromises = races.map(race => {
          if (new Date(race.date) < new Date()) {
            return fetchRaceResults(selectedYear, race.round)
              .then(results => ({
                ...race,
                results,
              }));
          } else {
            return Promise.resolve({ raceName: race.raceName, 
              date: race.date,
              time: race.time, });
          }
        });
  
        return Promise.all(raceResultsPromises);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  };
  
  const fetchRaceResults = async (selectedYear, raceId) => {
    const resultsUrl = `https://ergast.com/api/f1/${selectedYear}/${raceId}/results.json?limit=3`;
    try {
      const response = await fetch(resultsUrl);
      if (response.ok) {
        const data = await response.json();
        const results = data.MRData.RaceTable.Races[0].Results.map(result => ({
          driver: result.Driver,
          fastestLap: result.FastestLap,
          grid: result.grid,
          position: result.position,
          time: result.Time?.time || 'N/A',
          status: result.status,
          number: result.number,
        }));
        return results;
      }
    } catch (error) {
      console.error('Error fetching race results:', error);
    }
    return [];
  };  

  export const fetchUpcomingRace = async (selectedYear) => {
    const races = await fetchRaceDetails(selectedYear);
    const upcomingRace = races.find(race => new Date(race.date) > new Date());
    return upcomingRace || null;
  };

  export const getConstructorStandings = async (selectedYear) => {
    const baseURL = `https://ergast.com/api/f1/${selectedYear}`;
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
        throw new Error('Failed to fetch data');
      }
  
      const [constructorData, driverData] = await Promise.all([
        constructorResponse.json(),
        driverResponse.json()
      ]);
  
      const constructorStandings = constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(standing => ({
        constructorName: standing.Constructor.name,
        constructorId: standing.Constructor.constructorId,
        points: standing.points,
        driverCodes: []
      }));
  
      const driverStandings = driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  
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
  
      return constructorStandings;
    } catch (error) {
      console.error('Error fetching constructor standings:', error);
      return [];
    }
  };
  

  export const getDriverStandings = async (selectedYear) => {
    const url = `https://ergast.com/api/f1/${selectedYear}/driverStandings.json`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
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
      console.error('Error fetching driver standings:', error);
    }
    return [];
  };

  export const fetchDriversAndTires = async (sessionKey) => {
    if (!sessionKey) return [];
  
    const urls = {
      driversUrl: `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`,
      stintsUrl: `https://api.openf1.org/v1/stints?session_key=${sessionKey}`
    };
  
    try {
      const [driversResponse, stintsResponse] = await Promise.all([
        fetch(urls.driversUrl),
        fetch(urls.stintsUrl)
      ]);
  
      if (!driversResponse.ok) throw new Error('Failed to fetch drivers');
      if (!stintsResponse.ok) throw new Error('Failed to fetch stints');
  
      const [driversData, stintsData] = await Promise.all([
        driversResponse.json(),
        stintsResponse.json()
      ]);
  
      const stintsByDriver = stintsData.reduce((acc, { driver_number, lap_end, compound }) => {
        acc[driver_number] = acc[driver_number] || [];
        acc[driver_number].push({ lap_end, compound });
        return acc;
      }, {});
  
      return driversData.map(driver => ({
        ...driver,
        number: driver.driver_number,
        acronym: driver.name_acronym,
        tires: stintsByDriver[driver.driver_number] || []
      }));
    } catch (error) {
      console.error("Error fetching drivers and tires:", error);
      return [];
    }
  }; 

export const fetchRaceResultsByCircuit = async (year, circuitId) => {
  try {
    const url = `https://ergast.com/api/f1/${year}/circuits/${circuitId}/results.json`;
    const response = await fetch(url);
    const data = await response.json();
    const results = data.MRData.RaceTable.Races[0]?.Results;
    return results || [];
  } catch (error) {
    console.error("Error fetching race results:", error);
    return [];
  }
};

export const fetchQualifyingResultsByCircuit = async(year, circuitId) => {
  try {
    const url = `https://ergast.com/api/f1/${year}/circuits/${circuitId}/qualifying.json`;
    const response = await fetch(url);
    const data = await response.json();
    const results = data.MRData.RaceTable.Races[0]?.QualifyingResults;
    return results || [];
  } catch (error) {
    console.error("Error fetching race results:", error);
    return [];
  }
};

function scaleCoordinates(x, y, scale_factor) {
  return [x / scale_factor, y / scale_factor];
}

export async function fetchLocationData(sessionKey, driverId, startTime, endTime, scaleFactor = 100) {
  // const fetchStartTime = performance.now();

  // Assuming the base URL for API calls might be reused
  const baseUrl = 'https://api.openf1.org/v1';
  const locationUrl = `${baseUrl}/location?session_key=${sessionKey}&driver_number=${driverId}&date>${startTime}&date<${endTime}`;
  const carDataUrl = `${baseUrl}/car_data?session_key=${sessionKey}&driver_number=${driverId}&date>${startTime}&date<${endTime}`;

  const [locationResponse, carDataResponse] = await Promise.all([
    fetch(locationUrl),
    fetch(carDataUrl)
  ]);

  if (!locationResponse.ok || !carDataResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const [locationData, carData] = await Promise.all([
    locationResponse.json(),
    carDataResponse.json()
  ]);

  // const fetchEndTime = performance.now();
  // console.log(`Time taken to fetch data: ${(fetchEndTime - fetchStartTime).toFixed(2)} milliseconds`);
  
  // Sort location and car data by date
  locationData.sort((a, b) => new Date(a.date) - new Date(b.date));
  carData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Merge location and car data using a sliding window approach
  // const mergeStartTime = performance.now();
  let carDataIndex = 0;
  const mergedData = locationData.map(location => {
    const [scaledX, scaledY] = scaleCoordinates(location.x, location.y, scaleFactor);
    const locationDate = new Date(location.date);

    let closestCarData = carData[carDataIndex];
    let minTimeDiff = Math.abs(locationDate - new Date(closestCarData.date));

    for (let i = carDataIndex + 1; i < carData.length; i++) {
      const timeDiff = Math.abs(locationDate - new Date(carData[i].date));
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestCarData = carData[i];
        carDataIndex = i;
      } else {
        break;
      }
    }

    return {
      x: scaledX,
      y: scaledY,
      cardata: closestCarData,
    };
  });

  // const mergeEndTime = performance.now();
  // console.log(`Time taken to merge location data: ${(mergeEndTime - mergeStartTime).toFixed(2)} milliseconds`);

  return mergedData;
}