// Build per-competitor race-by-race points for F1A/F2 series data
// allRaceResults follows the shape returned by fetchAllRaceResults
// race keys commonly used: race0 (rescheduled/extra), race1 (Sprint), race2 (Feature), race3 (legacy)

const RACE_KEYS = ["race0", "race1", "race2", "race3"];

const buildBlankRow = (raceName) => ({
  raceName,
  pointsByKey: {},
  total: 0,
});

export const buildRacePointsMaps = (allRaceResults = []) => {
  const racesMeta = allRaceResults.map((race, idx) => ({
    raceName: race.raceName || race.Circuit?.circuitId || `Race ${idx + 1}`,
  }));

  const ensureRow = (map, id) => {
    if (!map.has(id)) {
      map.set(
        id,
        racesMeta.map((race) => buildBlankRow(race.raceName))
      );
    }
    return map.get(id);
  };

  const driverPointsByRace = new Map();
  const constructorPointsByRace = new Map();

  allRaceResults.forEach((race, raceIndex) => {
    RACE_KEYS.forEach((raceKey) => {
      const results = race[raceKey];
      if (!Array.isArray(results)) return;

      results.forEach((result) => {
        const points = Number(result.points) || 0;

        const driverId = result.Driver?.driverId;
        if (driverId) {
          const rows = ensureRow(driverPointsByRace, driverId);
          rows[raceIndex].pointsByKey[raceKey] =
            (rows[raceIndex].pointsByKey[raceKey] || 0) + points;
          rows[raceIndex].total += points;
        }

        const constructorId = result.Constructor?.constructorId;
        if (constructorId) {
          const rows = ensureRow(constructorPointsByRace, constructorId);
          rows[raceIndex].pointsByKey[raceKey] =
            (rows[raceIndex].pointsByKey[raceKey] || 0) + points;
          rows[raceIndex].total += points;
        }
      });
    });
  });

  return { racesMeta, driverPointsByRace, constructorPointsByRace };
};

export const DEFAULT_RACE_KEY_LABELS = {
  race1: "Sprint", // Sprint Race
  race2: "Feature", // Feature Race
  race0: "FR*", // Rescheduled Feature (when present)
  race3: "R3", // Legacy/extra slot
};
