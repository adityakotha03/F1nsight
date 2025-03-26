// utils/calculateF1aPoints2025.js

import { calculateFastestLapDriver } from "./calculateFastestLapDriver";

const race1Points = [10, 8, 6, 5, 4, 3, 2, 1];
const race2Points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export function calculateF1aPoints2025(allRaceResults) {
  const driverPoints = {};
  const constructorPoints = {};

  allRaceResults.forEach(race => {
    ['race1', 'race2'].forEach((raceKey, raceIndex) => {
      const results = race[raceKey];
      const fastestLapDriverNumber = calculateFastestLapDriver(results);
      const fastestLapDriver = results.find(d => d.number === fastestLapDriverNumber);

      results.forEach((result, index) => {
        const driverId = result.Driver.driverId;
        const constructorId = result.Constructor.constructorId;
        const code = result.Driver.code;
        const pointsFromFinish = raceIndex === 0
          ? race1Points[index] || 0
          : race2Points[index] || 0;

        const isFastestLap = result.number === fastestLapDriverNumber;
        const eligibleForFastestLap = (raceIndex === 0 && index < 8) || (raceIndex === 1 && index < 10);
        const fastestLapPoint = isFastestLap && eligibleForFastestLap ? 1 : 0;

        // Driver scoring
        if (!driverPoints[driverId]) {
          driverPoints[driverId] = {
            ...result.Driver,
            points: 0
          };
        }
        driverPoints[driverId].points += pointsFromFinish + fastestLapPoint;

        // Constructor scoring
        if (!constructorPoints[constructorId]) {
          constructorPoints[constructorId] = {
            ...result.Constructor,
            points: 0,
            driverCodes: new Set()
          };
        }
        constructorPoints[constructorId].points += pointsFromFinish + fastestLapPoint;
        constructorPoints[constructorId].driverCodes.add(code);
      });
    });

    // ✅ Add pole position bonus for Race 2 (driver who started P1)
    const poleDriver = race.race2.find(d => d.grid === "1");
    if (poleDriver) {
      const driverId = poleDriver.Driver.driverId;
      const constructorId = poleDriver.Constructor.constructorId;
      const code = poleDriver.Driver.code;

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
  });

  // Final formatting
  const formattedDrivers = Object.values(driverPoints).sort((a, b) => b.points - a.points);
  const formattedConstructors = Object.values(constructorPoints).map(constructor => ({
    ...constructor,
    driverCodes: Array.from(constructor.driverCodes)
  })).sort((a, b) => b.points - a.points);

  return { formattedDrivers, formattedConstructors };
}