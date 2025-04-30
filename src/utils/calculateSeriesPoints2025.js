import { calculateFastestLapDriver } from "./calculateFastestLapDriver";
import { wildCardDrivers } from "./wildCards";

const scoringConfigs = {
  F1A: {
    sprintKey: 'race1',
    featureKey: 'race2',
    sprintPoints: [10, 8, 6, 5, 4, 3, 2, 1],
    featurePoints: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
    fastestLapEligibility: { race1: 8, race2: 10 },
    poleBonusRace: 'race2',
  },
  F2: {
    sprintKey: 'race1',
    featureKey: 'race2',
    sprintPoints: [10, 8, 6, 5, 4, 3, 2, 1],
    featurePoints: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
    fastestLapEligibility: { race1: 10, race2: 10 },
    poleBonusRace: 'race2',
  }
};

export const calculateSeriesPoints2025 = (allRaceResults, championshipLevel) => {
  const config = scoringConfigs[championshipLevel];
  const driverPoints = {};
  const constructorPoints = {};

  allRaceResults.forEach(race => {
    const raceMap = {
      [config.sprintKey]: {
        points: config.sprintPoints,
        fastestLapLimit: config.fastestLapEligibility[config.sprintKey]
      },
      [config.featureKey]: {
        points: config.featurePoints,
        fastestLapLimit: config.fastestLapEligibility[config.featureKey]
      }
    };

    Object.entries(raceMap).forEach(([raceKey, { points, fastestLapLimit }]) => {
      const results = race[raceKey];
      const fastestLapDriverNumber = String(calculateFastestLapDriver(results, fastestLapLimit));
      let fastestLapPointAwarded = false;

      results.forEach((result, index) => {
        const driverId = result.Driver.driverId;
        const constructorId = result.Constructor.constructorId;
        const code = result.Driver.code;

        const positionIndex = parseInt(result.position, 10) - 1;
        const pointsFromFinish = points[positionIndex] || 0;
        let fastestLapPoint = 0;

        const isFastestLap = String(result.number) === fastestLapDriverNumber;
        const eligibleForFastestLap = index < fastestLapLimit;

        if (isFastestLap && eligibleForFastestLap && !fastestLapPointAwarded) {
          fastestLapPoint = 1;
          fastestLapPointAwarded = true;
        }

        // Add driver points
        if (!driverPoints[driverId]) {
          driverPoints[driverId] = {
            ...result.Driver,
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
            ...result.Constructor,
            points: 0,
            driverCodes: new Set()
          };
        }
        // console.log(`${result.Driver.code} P${result.position} | FL=${String(result.number) === String(fastestLapDriverNumber)} | ${pointsFromFinish} pts + ${fastestLapPoint} FL = ${pointsFromFinish + fastestLapPoint}`);
        constructorPoints[constructorId].points += pointsFromFinish + fastestLapPoint;
        constructorPoints[constructorId].driverCodes.add(code);
      });
    });

    // Pole bonus (driver only always, constructor only if config allows)
    if (race[config.poleBonusRace] && Array.isArray(race[config.poleBonusRace])) {
      const poleDriver = race[config.poleBonusRace]?.find(d => d.grid === "1" && (d.status === "Finished" || d.status === "cancelled"));

      if (poleDriver) {
        const driverId = poleDriver.Driver.driverId;
        const constructorId = poleDriver.Constructor.constructorId;
        const code = poleDriver.Driver.code;
    
        // ✅ Driver always gets 2 pts for pole
        if (!driverPoints[driverId]) {
          driverPoints[driverId] = {
            ...poleDriver.Driver,
            points: 0
          };
        }
        driverPoints[driverId].points += 2;

        if (!constructorPoints[constructorId]) {
          constructorPoints[constructorId] = {
            ...poleDriver.Constructor,
            points: 0,
            driverCodes: new Set()
          };
        }
        constructorPoints[constructorId].points += 2;
        constructorPoints[constructorId].driverCodes.add(code);
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