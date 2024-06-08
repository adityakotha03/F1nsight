const BASE_URL = 'http://ergast.com/api/f1';

export const fetchDriversList = async () => {
  const response = await fetchWithCache(`${BASE_URL}/drivers.json?limit=1000`); // Adjust limit as needed
  return response.MRData.DriverTable.Drivers.map(driver => ({
      id: driver.driverId,
      name: `${driver.givenName} ${driver.familyName}`
  }));
};

const createAndDownloadFile = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
        console.log("here", data1);
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
  console.log("yay",driverData1);
  return {driver1: driverData1, driver2: driverData2};
}

// export const fetchDriverStats = async (driverId1, driverId2) => {
//     const fetchDriverData = async (driverId) => {
//         try {
//             // Fetch all seasons the driver has participated in
//             const seasonsResponse = await fetchWithCache(`${BASE_URL}/drivers/${driverId}/seasons.json`);
//             const seasons = seasonsResponse.MRData.SeasonTable.Seasons.map(season => season.season);

//             let finalStandings = {};
//             let posAfterRace = {};
//             let racePosition = {};
//             let qualiPosition = {};
//             let totalWins = 0;
//             let totalPodiums = 0;
//             let totalPoles = 0;

//             // Collect promises for fetching data in parallel
//             const standingsPromises = seasons.map(year =>
//                 fetchWithCache(`${BASE_URL}/${year}/drivers/${driverId}/driverStandings.json`)
//             );

//             const raceResultsPromises = seasons.map(year =>
//                 fetchWithCache(`${BASE_URL}/${year}/drivers/${driverId}/results.json`)
//             );

//             const qualifyingResultsPromises = seasons.map(year =>
//                 fetchWithCache(`${BASE_URL}/${year}/drivers/${driverId}/qualifying.json`)
//             );

//             const [standingsResponses, raceResultsResponses, qualifyingResultsResponses] = await Promise.all([
//                 Promise.all(standingsPromises),
//                 Promise.all(raceResultsPromises),
//                 Promise.all(qualifyingResultsPromises)
//             ]);

//             // Process standings responses
//             standingsResponses.forEach((response, index) => {
//                 const year = seasons[index];
//                 const standings = response.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
//                 finalStandings[year] = {
//                     year: year,
//                     position: standings.position,
//                     points: standings.points
//                 };
//             });

//             // Process race results and position after race
//             raceResultsResponses.forEach((response, index) => {
//                 const year = seasons[index];
//                 const raceResults = response.MRData.RaceTable.Races;
//                 racePosition[year] = { year: year, positions: {} };
//                 posAfterRace[year] = { year: year, pos: {} };

//                 let cumulativePoints = 0;
//                 raceResults.forEach(race => {
//                     const raceName = race.raceName;
//                     const raceResult = race.Results[0];
//                     const position = raceResult.position;
//                     const points = parseFloat(raceResult.points);
//                     cumulativePoints += points;

//                     racePosition[year].positions[raceName] = position;
//                     posAfterRace[year].pos[raceName] = {
//                         positionInDriverStandings: raceResult.Driver.position,
//                         points: cumulativePoints
//                     };

//                     if (position === '1') totalWins++;
//                     if (['1', '2', '3'].includes(position)) totalPodiums++;
//                 });
//             });

//             // Process qualifying results
//             qualifyingResultsResponses.forEach((response, index) => {
//                 const year = seasons[index];
//                 const qualifyingResults = response.MRData.RaceTable.Races;
//                 qualiPosition[year] = { year: year, positions: {} };

//                 qualifyingResults.forEach(race => {
//                     const raceName = race.raceName;
//                     const qualifyingResult = race.QualifyingResults[0];
//                     const position = qualifyingResult.position;

//                     qualiPosition[year].positions[raceName] = position;
//                     if (position === '1') totalPoles++;
//                 });
//             });

//             return {
//                 driverId: driverId,
//                 finalStandings,
//                 posAfterRace,
//                 racePosition,
//                 qualiPosition,
//                 totalWins,
//                 totalPodiums,
//                 totalPoles
//             };

//         } catch (error) {
//             console.error(`Error fetching data for driver ${driverId}:`, error);
//             return null;
//         }
//     };

//     const driver1Data = await fetchDriverData(driverId1);
//     createAndDownloadFile(driver1Data, `${driverId1}.json`);
//     const driver2Data = await fetchDriverData(driverId2);
//     // createAndDownloadFile({ driver1: driver1Data, driver2: driver2Data }, 'driverComparisonData.json');
//     return { driver1: driver1Data, driver2: driver2Data };
// };



// export const fetchDriverStats = async (driverId1, driverId2) => {
//   const BASE_URL = 'http://ergast.com/api/f1';
//   const fetchDriverData = async (driverId) => {
//     try {
//       const seasonsResponse = await axios.get(`${BASE_URL}/drivers/${driverId}/seasons.json`);
//       const seasons = seasonsResponse.data.MRData.SeasonTable.Seasons.map(season => season.season);

//       let finalStandings = {};
//       let posAfterRace = {};
//       let racePosition = {};
//       let qualiPosition = {};
//       let totalWins = 0;
//       let totalPodiums = 0;
//       let totalPoles = 0;

//       const standingsPromises = seasons.map(year =>
//         axios.get(`${BASE_URL}/${year}/drivers/${driverId}/driverStandings.json`)
//       );

//       const raceResultsPromises = seasons.map(year =>
//         axios.get(`${BASE_URL}/${year}/drivers/${driverId}/results.json`)
//       );

//       const qualifyingResultsPromises = seasons.map(year =>
//         axios.get(`${BASE_URL}/${year}/drivers/${driverId}/qualifying.json`)
//       );

//       const [standingsResponses, raceResultsResponses, qualifyingResultsResponses] = await Promise.all([
//         Promise.all(standingsPromises),
//         Promise.all(raceResultsPromises),
//         Promise.all(qualifyingResultsPromises)
//       ]);

//       standingsResponses.forEach((response, index) => {
//         const year = seasons[index];
//         const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
//         finalStandings[year] = {
//             year: year,
//             position: standings.position,
//             points: standings.points
//         };
//       });

//       raceResultsResponses.forEach((response, index) => {
//         const year = seasons[index];
//         const raceResults = response.data.MRData.RaceTable.Races;
//         racePosition[year] = { year: year, positions: {} };
//         posAfterRace[year] = { year: year, pos: {} };

//         let cumulativePoints = 0;
//         raceResults.forEach(race => {
//             const raceName = race.raceName;
//             const raceResult = race.Results[0];
//             const position = raceResult.position;
//             const points = parseFloat(raceResult.points);
//             cumulativePoints += points;

//             racePosition[year].positions[raceName] = position;
//             posAfterRace[year].pos[raceName] = {
//                 positionInDriverStandings: raceResult.Driver.position,
//                 points: cumulativePoints
//             };

//             if (position === '1') totalWins++;
//             if (['1', '2', '3'].includes(position)) totalPodiums++;
//         });
//       });

//       qualifyingResultsResponses.forEach((response, index) => {
//         const year = seasons[index];
//         const qualifyingResults = response.data.MRData.RaceTable.Races;
//         qualiPosition[year] = { year: year, positions: {} };

//         qualifyingResults.forEach(race => {
//             const raceName = race.raceName;
//             const qualifyingResult = race.QualifyingResults[0];
//             const position = qualifyingResult.position;

//             qualiPosition[year].positions[raceName] = position;
//             if (position === '1') totalPoles++;
//         });
//       });

//       return {
//         driverId: driverId,
//         finalStandings,
//         posAfterRace,
//         racePosition,
//         qualiPosition,
//         totalWins,
//         totalPodiums,
//         totalPoles
//       };

//     } catch (error) {
//       console.error(`Error fetching data for driver ${driverId}:`, error);
//       return null;
//     }
//   };

//   const driver1Data = await fetchDriverData(driverId1);
//   const driver2Data = await fetchDriverData(driverId2);
//   console.log("Fetching done");
//   return { driver1: driver1Data, driver2: driver2Data };
// };



// export const fetchDriverStats = async (driverId1, driverId2) => {
//   const BASE_URL = 'http://ergast.com/api/f1';
//   const fetchDriverData = async (driverId) => {
//       try {
//           const seasonsResponse = await fetch(`${BASE_URL}/drivers/${driverId}/seasons.json`);
//           const seasonsResponsedata = await seasonsResponse.json();
//           const seasons = seasonsResponsedata.MRData.SeasonTable.Seasons.map(season => season.season);

//           let finalStandings = {};
//           let posAfterRace = {};
//           let racePosition = {};
//           let qualiPosition = {};
//           let totalWins = 0;
//           let totalPodiums = 0;
//           let totalPoles = 0;

//           for (let year of seasons) {
//               const standingsResponse = await fetch(`${BASE_URL}/${year}/drivers/${driverId}/driverStandings.json`);
//               const standingsResponsedata = await standingsResponse.json();
//               const standings = standingsResponsedata.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
//               finalStandings[year] = {
//                   year: year,
//                   position: standings.position,
//                   points: standings.points
//               };

//               const raceResultsResponse = await fetch(`${BASE_URL}/${year}/drivers/${driverId}/results.json`);
//               const raceResultsResponsedata = await raceResultsResponse.json();
//               const raceResults = raceResultsResponsedata.MRData.RaceTable.Races;

//               racePosition[year] = { year: year, positions: {} };
//               posAfterRace[year] = { year: year, pos: {} };

//               let cumulativePoints = 0;

//               for (let race of raceResults) {
//                   const raceName = race.raceName;
//                   const raceResult = race.Results[0];
//                   const position = raceResult.position;
//                   const points = parseFloat(raceResult.points);
//                   cumulativePoints += points;

//                   racePosition[year].positions[raceName] = position;
//                   posAfterRace[year].pos[raceName] = {
//                       positionInDriverStandings: raceResult.Driver.position,
//                       points: cumulativePoints
//                   };

//                   if (position === '1') totalWins++;
//                   if (['1', '2', '3'].includes(position)) totalPodiums++;
//               }

//               const qualifyingResultsResponse = await fetch(`${BASE_URL}/${year}/drivers/${driverId}/qualifying.json`);
//               const qualifyingResultsResponsedata = await qualifyingResultsResponse.json();
//               const qualifyingResults = qualifyingResultsResponsedata.MRData.RaceTable.Races;

//               qualiPosition[year] = { year: year, positions: {} };

//               for (let race of qualifyingResults) {
//                   const raceName = race.raceName;
//                   const qualifyingResult = race.QualifyingResults[0];
//                   const position = qualifyingResult.position;

//                   qualiPosition[year].positions[raceName] = position;
//                   if (position === '1') totalPoles++;
//               }
//           }

//           return {
//               driverId: driverId,
//               finalStandings,
//               posAfterRace,
//               racePosition,
//               qualiPosition,
//               totalWins,
//               totalPodiums,
//               totalPoles
//           };

//       } catch (error) {
//           console.error(`Error fetching data for driver ${driverId}:`, error);
//           return null;
//       }
//   };

//   const driver1Data = await fetchDriverData(driverId1);
//   const driver2Data = await fetchDriverData(driverId2);

//   return { driver1: driver1Data, driver2: driver2Data };
// };

  // export const fetchDriverStats = async (driverId, selectedYear) => {
  //   const baseURL = `https://ergast.com/api/f1/${selectedYear}/drivers/${driverId}`;
  //   const urls = {
  //     raceResultsUrl: `${baseURL}/results.json`,
  //     qualiResultsUrl: `${baseURL}/qualifying.json`
  //   };
  //   try {
  //     const [raceResponse, qualiResponse] = await Promise.all([
  //       fetch(urls.raceResultsUrl),
  //       fetch(urls.qualiResultsUrl)
  //     ]);
  
  //     if (!raceResponse.ok || !qualiResponse.ok) {
  //       throw new Error('Failed to fetch data');
  //     }
  
  //     const [raceData, qualiData] = await Promise.all([
  //       raceResponse.json(),
  //       qualiResponse.json()
  //     ]);

  //     console.log(qualiResponse);

  //     const raceResults = raceData.MRData.RaceTable.Races;
  //     const qualifyingResults = qualiData.MRData.RaceTable.Races;

  //     let totalWins = 0;
  //     // let totalPoints = 0;
  //     const raceStandings = [];
  //     const qualifyingStandings = [];
  //     const pointsperRace = [];

  //     raceResults.forEach(race => {
  //       const raceResult = race.Results[0];
  //       const position = raceResult.position;
  //       const points = parseFloat(raceResult.points);
  //       const raceName = race.raceName;

  //       raceStandings.push({ raceName, position });
  //       pointsperRace.push({ raceName, points });
  //       // totalPoints += points;
  //       if (position === '1') {
  //         totalWins++;
  //       }
  //     });

  //     qualifyingResults.forEach(race => {
  //       const qualifyingResult = race.QualifyingResults[0];
  //       const position = qualifyingResult.position;
  //       const raceName = race.raceName;

  //       qualifyingStandings.push({ raceName, position });
  //     });

  //     return {
  //       raceStandings,
  //       qualifyingStandings,
  //       pointsperRace,
  //       totalWins
  //     };

  //   } catch(error) {
  //     console.error('Failed to fetch data', error);
  //   }
  //   return [];
  // }
  
  export const fetchDriverStandings = async (driverId) => {
    const url = `https://ergast.com/api/f1/drivers/${driverId}/driverStandings.json`;
    try {
      const response  = await fetch(url);
      if(response.ok){
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Failed to f data');
      }
    } catch (error){
      console.error('Failed to fetch data');
    }
  }

  export const fetchDriverResults = async (driverId) => {
    const url = `https://ergast.com/api/f1/drivers/${driverId}/results.json`;
    try {
      const response  = await fetch(url);
      if(response.ok){
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Failed to f data');
      }
    } catch (error){
      console.error('Failed to fetch data');
    }
  }

  export const fetchDriverQualifying = async (driverId) => {
    const url = `https://ergast.com/api/f1/drivers/${driverId}/qualifying.json`;
    try {
      const response  = await fetch(url);
      if(response.ok){
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Failed to f data');
      }
    } catch (error){
      console.error('Failed to fetch data');
    }
  }
  
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