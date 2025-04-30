import axios from "axios";

export const fetchDriversList = async () => {
  const response = await fetchWithCache(`https://praneeth7781.github.io/f1nsight-api-2/driversList.json`);
  // console.log("New one");
  return response.map(driver => ({
    id: driver.driverId,
    name: `${driver.givenName} ${driver.familyName}`
  }));
};

const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Simple in-memory cache
const cache = {};

const fetchWithCache = async (url) => {
    if (cache[url]) {
        return cache[url];
    }
    const data = await fetchData(url);
    cache[url] = data;
    return data;
};

export const fetchDriverStats = async (driverId1, driverId2) => {
  const fetchDriverData = async (driverId) => {
    try{
      const dataResponse1 = await fetch(`https://praneeth7781.github.io/f1nsight-api-2/drivers/${driverId}.json`);
      if(dataResponse1.ok){
        const data1 = await dataResponse1.json();
        // console.log("here", data1);
        return data1;
      }else{
        console.log("Failed to fetch data");
      }
      // console.log(dataResponse.json());
    } catch(error){
      console.log(error);
    }
  }
  const driverData1 = await fetchDriverData(driverId1);
  const driverData2 = await fetchDriverData(driverId2);
  return {driver1: driverData1, driver2: driverData2};
}



export const fetchRaceMeetingKeys = async (selectedYear) => {
  try {
    const raceResponse = await fetch(`https://praneeth7781.github.io/f1nsight-api-2/races/races.json`);
    if(!raceResponse.ok) {
      throw new Error('Failed to fetch races');
    }
    const races = await raceResponse.json();
    return races[selectedYear]
  } catch(error) {
    console.error('Error fetching data:', error);
  }
};

// Header
export const fetchRacesAndSessions = async (selectedYear) => {
  try {
      // Fetch races
      const racesResponse = await fetch(`https://api.openf1.org/v1/meetings?year=${selectedYear}`);
      if (!racesResponse.ok) {
          throw new Error('Failed to fetch races');
      }
      const racesData = await racesResponse.json();

      // Fetch sessions
      const sessionsResponse = await fetch(`https://api.openf1.org/v1/sessions?year=${selectedYear}&session_name=Race`);
      if (!sessionsResponse.ok) {
          throw new Error('Failed to fetch sessions');
      }
      const sessionsData = await sessionsResponse.json();

      // Filter races based on meeting_key presence in sessions
      const filteredRaces = racesData.filter(race => 
          sessionsData.some(session => session.meeting_key === race.meeting_key)
      );
      // console.log('12', filteredRaces);
      return filteredRaces;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};
  
// race results page
export const fetchRaceDetails = async (selectedYear) => {
  const url = `https://praneeth7781.github.io/f1nsight-api-2/races/${selectedYear}/raceDetails.json`; 
  try {
    const response = await fetch(url);
    if (response.ok) {
      // const data = await response.json();
      // const races = data.MRData.RaceTable.Races;
      const races = await response.json();
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
            season: race.season,
            round: race.round,
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
  const resultsUrl = `https://praneeth7781.github.io/f1nsight-api-2/races/${selectedYear}/results.json`;
  try {
    const response = await fetch(resultsUrl);
    if (response.ok) {
      // const data = await response.json();
      const tempdata = await response.json();
      const data = tempdata.find(element => element.round === raceId).Results.slice(0,3);
      // console.log('response', data);

      // console.log(data.slice(0,3));
      const results = data.map(result => ({
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


export const getPartialConstructorStandings = async (selectedYear, start, end) => {
  const baseURL = `https://praneeth7781.github.io/f1nsight-api-2/races/${selectedYear}`;
  const urls = {
    constructorUrl: `${baseURL}/constructorStandings.json`,
    driverUrl: `${baseURL}/driverStandings.json`
  };

  try {
    const [constructorResponse, driverResponse] = await Promise.all([
      fetch(urls.constructorUrl),
      fetch(urls.driverUrl)
    ]);
    // const constructorResponse = await fetch(url);

    if (!constructorResponse.ok || !driverResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    // const constructorData = constructorResponse.json();

    const [constructorData, driverData] = await Promise.all([
      constructorResponse.json(),
      driverResponse.json()
    ]);

    // console.log("Here", constructorData, start, end);

    let startStandings = []
    if(parseInt(start)===1){
      startStandings = constructorData[start].map(standing => ({
        constructorName: standing.Constructor.name,
        constructorId: standing.Constructor.constructorId,
        points: 0,
        driverCodes: []
      }))
    } else {
      // console.log("Value of start is: ", start)
      startStandings = constructorData[start-1].map(standing => ({
        constructorName: standing.Constructor.name,
        constructorId: standing.Constructor.constructorId,
        points: standing.points,
        driverCodes: []
      }))
    }
    // console.log(startStandings);


    let endStandings = constructorData[end].map(standing => ({
      constructorName: standing.Constructor.name,
      constructorId: standing.Constructor.constructorId,
      points: standing.points,
      driverCodes: []
    }))

    const constructorStandings = startStandings.map(start => {
      const end = endStandings.find(end => end.constructorId === start.constructorId);
      return {
        constructorName: start.constructorName,
        constructorId: start.constructorId,
        points: (end ? end.points : 0) - start.points,
        driverCodes: start.driverCodes
      };
    });

    // const constructorStandings = constructorData['latest'].map(standing => ({
    //   constructorName: standing.Constructor.name,
    //   constructorId: standing.Constructor.constructorId,
    //   points: standing.points,
    //   driverCodes: []
    // }));
    // const baseURL = `https://praneeth7781.github.io/f1nsight-api-2/constructors/${selectedYear}`

    // const driverStandings = driverData['latest'];
    const Keys = Object.keys(driverData).sort();
    const lastKey = Keys[Keys.length - 1];
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

    return constructorStandings.sort((a,b) => parseInt(b.points)-parseInt(a.points));
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    return [];
  }
}

export const getConstructorStandings = async (selectedYear) => {
  const baseURL = `https://praneeth7781.github.io/f1nsight-api-2/races/${selectedYear}`;
  const constructorUrl = `${baseURL}/constructorStandings.json`;

  try {
    const constructorResponse = await fetch(constructorUrl);
    if (!constructorResponse.ok) {
      throw new Error('Failed to fetch constructor standings data');
    }
    const constructorData = await constructorResponse.json();

    const colorsResponse = await axios.get('https://praneeth7781.github.io/f1nsight-api-2/colors/teams.json');
    const teamColors = colorsResponse.data;

    const raceKeys = Object.keys(constructorData).sort();
    const lastRaceKey = raceKeys[raceKeys.length - 1];
    const data_constructor = constructorData[lastRaceKey] || [];

    const constructorStandings = data_constructor.map(standing => ({
      constructorName: standing.Constructor.name,
      constructorId: standing.Constructor.constructorId,
      points: standing.points,
      driverCodes: [],
      constructorColor: `#${teamColors[selectedYear][standing.Constructor.constructorId]}` || '#000000', // Default color if not found
    }));

    // For each constructor, fetch the associated drivers from the new endpoint
    const driverFetchPromises = constructorStandings.map(async (constructorStanding) => {
      const constructorId = constructorStanding.constructorId;
      const driverUrl = `https://praneeth7781.github.io/f1nsight-api-2/constructors/${selectedYear}/${constructorId}.json`;
      
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
    console.error('Error fetching constructor standings:', error);
    return [];
  }
};
  

export const getDriverStandings = async (selectedYear) => {
  const url = `https://praneeth7781.github.io/f1nsight-api-2/races/${selectedYear}/driverStandings.json`;
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
    console.error('Error fetching driver standings:', error);
  }
  return [];
};

export const getPartialDriverStandings = async (selectedYear, start, end) => {
  const url = `https://praneeth7781.github.io/f1nsight-api-2/races/${selectedYear}/driverStandings.json`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      let endStandings = data[end];
      let startStandings = [];
      if(parseInt(start)!==1) startStandings = data[start-1];
      // console.log(endStandings);
      const standings =  endStandings.map(end => {
        const start = startStandings.find(start => start.Driver.driverId === end.Driver.driverId);
        return {
          driverCode : end.Driver.code,
          firstName : end.Driver.givenName,
          lastName : end.Driver.lastName,
          constructorName : end.Constructors[0].name,
          constructorId : end.Constructors[0].constructorId,
          points : end.points - (start ? start.points : 0)
        }
      });
      // const standings = data['latest'];
      return standings.sort((a,b) => parseInt(b.points)-parseInt(a.points));
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

    const url = `https://praneeth7781.github.io/f1nsight-api-2/races/${year}/results.json`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    const results = data.find(element => element.Circuit.circuitId === circuitId).Results;
    return results || [];
  } catch (error) {
    console.error("Error fetching race results:", error);
    return []
  }
};

export const fetchQualifyingResultsByCircuit = async(year, circuitId) => {
  try {
    const url = `https://praneeth7781.github.io/f1nsight-api-2/races/${year}/qualifying.json`;
    const response = await fetch(url);
    const data = await response.json();
    const results = data.find(element => element.Circuit.circuitId === circuitId).QualifyingResults;
    return results || [];
  } catch(error){
    console.error("Error fetching qualifiying results:", error);
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

export const fetchMostRecentRace = async (selectedYear) => {
  try {
    // Fetch the race details
    const raceDetailsResponse = await fetch(`https://praneeth7781.github.io/f1nsight-api-2/races/${selectedYear}/raceDetails.json`);
    if (!raceDetailsResponse.ok) {
      throw new Error('Failed to fetch race details');
    }
    const raceDetails = await raceDetailsResponse.json();    
    // Fetch the meeting keys
    const meetingKeys = await fetchRaceMeetingKeys(selectedYear);    
    // Filter out races that haven't happened yet
    const pastRaces = raceDetails.filter(race => new Date(race.date) <= new Date());    
    // Sort races by date in descending order (most recent first)
    const sortedRaces = pastRaces.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get the most recent race (first after sorting)
    const mostRecentRace = sortedRaces[0];    
    // If no past races exist (all races are in the future), handle gracefully
    if (!mostRecentRace) {
      console.log("No past races available.");
      return null;
    }
    
    // Get the meeting key for the most recent race
    const meetingKey = meetingKeys[mostRecentRace.raceName]?.meeting_key || 'unknown';
    
    // Fetch race results for the most recent race
    const raceResults = await fetchRaceResults(selectedYear, mostRecentRace.round);

    // Combine the race details and results, including the meeting key
    const raceWithDetails = {
      ...mostRecentRace,
      meetingKey,
      raceResults,
    };

    return raceWithDetails;
  } catch (error) {
    console.error('Error fetching race details:', error);
  }
  return null;  // Return null if there's an error
};
