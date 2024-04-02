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
              time: race.time });
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
          position: result.position,
          driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
          time: result.Time?.time || 'N/A',
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
    const url = `https://ergast.com/api/f1/${selectedYear}/constructorStandings.json`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        return standings.map(standing => ({
          constructorName: standing.Constructor.name,
          points: standing.points,
        }));
      }
    } catch (error) {
      console.error('Error fetching constructor standings:', error);
    }
    return [];
  };

  export const getDriverStandings = async (selectedYear) => {
    const url = `https://ergast.com/api/f1/${selectedYear}/driverStandings.json`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        return standings.map(standing => ({
          driverName: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
          constructorName: standing.Constructors[0].name,
          points: standing.points,
        }));
      }
    } catch (error) {
      console.error('Error fetching driver standings:', error);
    }
    return [];
  };
  