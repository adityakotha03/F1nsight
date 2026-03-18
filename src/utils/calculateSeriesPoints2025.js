import { calculateFastestLapDriver } from "./calculateFastestLapDriver";
import { wildCardDrivers } from "./wildCards";

const scoringConfigs = {
  F1A: {
    rescheduledFeatureKey: 'race0', // rescheduled race
    sprintKey: 'race1',
    featureKey: 'race2',
    sprintPoints: [10, 8, 6, 5, 4, 3, 2, 1],
    featurePoints: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
    fastestLapEligibility: { race1: 8, race2: 10 },
    poleBonusRace: 'race2',
  },
  F2: {
    rescheduledFeatureKey: 'race0', // rescheduled race
    sprintKey: 'race1',
    featureKey: 'race2',
    sprintPoints: [10, 8, 6, 5, 4, 3, 2, 1],
    featurePoints: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
    fastestLapEligibility: { race1: 10, race2: 10 },
    poleBonusRace: 'race2',
  },
};

export const calculateSeriesPoints2025 = (allRaceResults, championshipLevel) => {
  const config = scoringConfigs[championshipLevel];
  const driverPoints = {};
  const constructorPoints = {};

  const isEligibleForFastestLapPoint = (result, fastestLapLimit) => {
    const finishPosition = parseInt(result?.position, 10);
    return (
      Number.isFinite(finishPosition) &&
      finishPosition >= 1 &&
      finishPosition <= fastestLapLimit
    );
  };

  allRaceResults.forEach(race => {
    const raceMap = {
      [config.sprintKey]: {
        points: config.sprintPoints,
        fastestLapLimit: config.fastestLapEligibility[config.sprintKey]
      },
      [config.featureKey]: {
        points: config.featurePoints,
        fastestLapLimit: config.fastestLapEligibility[config.featureKey]
      },
      [config.rescheduledFeatureKey]: {
        points: config.featurePoints,
        fastestLapLimit: config.fastestLapEligibility[config.featureKey]
      }
    };

    Object.entries(raceMap).forEach(([raceKey, { points, fastestLapLimit }]) => {
      const results = race[raceKey];
      if (!Array.isArray(results)) return;

      const fastestLapDriverNumber = String(calculateFastestLapDriver(results, fastestLapLimit));
      let fastestLapPointAwarded = false;

      results.forEach((result) => {
        const resolvedDriver = result?.Driver;
        const resolvedConstructor = result?.Constructor;
        if (!resolvedDriver?.driverId || !resolvedConstructor?.constructorId) {
          console.warn("Skipping points: missing enriched driver/constructor", {
            championshipLevel,
            raceName: race?.raceName,
            raceKey,
            number: result?.number,
            hasDriver: Boolean(resolvedDriver?.driverId),
            hasConstructor: Boolean(resolvedConstructor?.constructorId),
          });
          return;
        }

        const driverId = resolvedDriver.driverId;
        const constructorId = resolvedConstructor.constructorId;
        const code = resolvedDriver.code;

        const finishPosition = parseInt(result.position, 10);
        const positionIndex = Number.isFinite(finishPosition)
          ? finishPosition - 1
          : -1;
        const pointsFromFinish = points[positionIndex] || 0;
        let fastestLapPoint = 0;

        const isFastestLap = String(result.number) === fastestLapDriverNumber;
        const eligibleForFastestLap = isEligibleForFastestLapPoint(
          result,
          fastestLapLimit
        );

        if (isFastestLap && eligibleForFastestLap && !fastestLapPointAwarded) {
          fastestLapPoint = 1;
          fastestLapPointAwarded = true;
        }

        // Add driver points
        if (!driverPoints[driverId]) {
          driverPoints[driverId] = {
            ...resolvedDriver,
            points: 0
          };
        }
        driverPoints[driverId].points += pointsFromFinish + fastestLapPoint;

        if ((championshipLevel === 'F1A' && wildCardDrivers[2025]) && wildCardDrivers[2025].includes(code)) {
          console.log(`Skipping wild card driver ${code} for constructor ${constructorId}`);
          return;
        }

        // Add constructor points
        if (!constructorPoints[constructorId]) {
          constructorPoints[constructorId] = {
            ...resolvedConstructor,
            points: 0,
            driverCodes: new Set()
          };
        }
        // console.log(`${result.Driver.code} P${result.position} | FL=${String(result.number) === String(fastestLapDriverNumber)} | ${pointsFromFinish} pts + ${fastestLapPoint} FL = ${pointsFromFinish + fastestLapPoint}`);
        constructorPoints[constructorId].points += pointsFromFinish + fastestLapPoint;
        constructorPoints[constructorId].driverCodes.add(code);
      });
    });

    // Pole bonus for Race 2 final grid
    if (race[config.poleBonusRace] && Array.isArray(race[config.poleBonusRace])) {
      const poleDriver = race[config.poleBonusRace]?.find(
        (d) => parseInt(d.grid, 10) === 1
      );

      if (poleDriver) {
        const resolvedPoleDriver = poleDriver?.Driver;
        const driverId = resolvedPoleDriver?.driverId;
        if (!driverId) {
          console.warn("Skipping pole bonus: missing enriched pole driver", {
            championshipLevel,
            raceName: race?.raceName,
            raceKey: config.poleBonusRace,
            number: poleDriver?.number,
            grid: poleDriver?.grid,
          });
          return;
        }
    
        // Driver gets 2 pts for pole
        if (!driverPoints[driverId]) {
          driverPoints[driverId] = {
            ...resolvedPoleDriver,
            points: 0
          };
        }
        driverPoints[driverId].points += 2;
      }
    }
  });

  const formattedDrivers = Object.values(driverPoints).sort((a, b) => b.points - a.points);
  const formattedConstructors = Object.values(constructorPoints).map(constructor => ({
    ...constructor,
    driverCodes: Array.from(constructor.driverCodes)
  })).sort((a, b) => b.points - a.points);

  return { formattedDrivers, formattedConstructors };
};