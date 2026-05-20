import { buildOpenF1Url } from "../config/openf1";
import { buildF1nsightApiUrl } from "./client";

const isCancelledRace = (selectedYear, round) => (
  Number(selectedYear) === 2026 && ["4", "5"].includes(String(round))
);

export const fetchRaceMeetingKeys = async (selectedYear) => {
  try {
    const raceResponse = await fetch(buildF1nsightApiUrl("/races/races.json"));
    if (!raceResponse.ok) {
      throw new Error("Failed to fetch races");
    }
    const races = await raceResponse.json();
    return races[selectedYear];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchRacesAndSessions = async (selectedYear) => {
  try {
    const racesResponse = await fetch(`${buildOpenF1Url("/meetings")}?year=${selectedYear}`);
    if (!racesResponse.ok) {
      throw new Error("Failed to fetch races");
    }
    const racesData = await racesResponse.json();

    const sessionsResponse = await fetch(`${buildOpenF1Url("/sessions")}?year=${selectedYear}&session_name=Race`);
    if (!sessionsResponse.ok) {
      throw new Error("Failed to fetch sessions");
    }
    const sessionsData = await sessionsResponse.json();

    return racesData.filter(race =>
      sessionsData.some(session => session.meeting_key === race.meeting_key)
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchRaceResults = async (selectedYear, raceId) => {
  const resultsUrl = buildF1nsightApiUrl(`/races/${selectedYear}/results.json`);
  console.log('inside fetchRaceResults', resultsUrl)
  try {
    const response = await fetch(resultsUrl);
    console.log('response', response)
    if (response.ok) {
      const tempdata = await response.json();
      console.log('tempdata', tempdata)
      const raceData = tempdata.find(element => element.round === raceId);
      console.log('raceData', raceData)
      if (!raceData?.Results) return [];

      return raceData.Results.slice(0, 3).map(result => ({
        driver: result.Driver,
        fastestLap: result.FastestLap,
        grid: result.grid,
        position: result.position,
        time: result.Time?.time || "N/A",
        status: result.status,
        number: result.number,
      }));
    }
  } catch (error) {
    console.error("Error fetching race results:", error);
  }
  return [];
};

export const fetchRaceDetails = async (selectedYear) => {
  const url = buildF1nsightApiUrl(`/races/${selectedYear}/raceDetails.json`);
  try {
    const response = await fetch(url);
    if (response.ok) {
      const races = await response.json();
      const raceResultsPromises = races.map(race => {
        if (isCancelledRace(selectedYear, race.round)) {
          return Promise.resolve({
            ...race,
            results: [],
            isCancelled: true,
          });
        }

        if (new Date(race.date) < new Date()) {
          return fetchRaceResults(selectedYear, race.round)
            .then(results => ({
              ...race,
              results,
            }));
        }

        return Promise.resolve({
          raceName: race.raceName,
          date: race.date,
          season: race.season,
          round: race.round,
          time: race.time,
        });
      });

      return Promise.all(raceResultsPromises);
    }
    console.error("Failed to fetch data");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return [];
};

export const fetchUpcomingRace = async (selectedYear) => {
  const races = await fetchRaceDetails(selectedYear);
  const upcomingRace = races.find(race => new Date(race.date) > new Date());
  return upcomingRace || null;
};

export const fetchMostRecentRace = async (selectedYear) => {
  try {
    const raceDetailsResponse = await fetch(buildF1nsightApiUrl(`/races/${selectedYear}/raceDetails.json`));
    if (!raceDetailsResponse.ok) {
      throw new Error("Failed to fetch race details");
    }
    const raceDetails = await raceDetailsResponse.json();
    console.log('raceDetails', raceDetails)
    const meetingKeys = await fetchRaceMeetingKeys(selectedYear);
    const pastRaces = raceDetails.filter(race => new Date(race.date) <= new Date());
    const sortedRaces = pastRaces.sort((a, b) => new Date(b.date) - new Date(a.date));
    const mostRecentRace = sortedRaces[0];

    if (!mostRecentRace) {
      console.log("No past races available.");
      return null;
    }

    const meetingKey = meetingKeys[mostRecentRace.raceName]?.meeting_key || "unknown";
    console.log('outside fetchRaceResults')
    const raceResults = await fetchRaceResults(selectedYear, mostRecentRace.round);

    return {
      ...mostRecentRace,
      meetingKey,
      raceResults,
    };
  } catch (error) {
    console.error("Error fetching race details:", error);
  }
  return null;
};
