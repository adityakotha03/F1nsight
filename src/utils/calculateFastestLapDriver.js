export function calculateFastestLapDriver(results, eligibleLimit) {
  // Safety check for undefined or invalid results
  if (!results || !Array.isArray(results)) {
    return null;
  }

  let fastestLapTime = null;
  let fastestLapDriverNumber = null;

  results.forEach((result, index) => {
    if (index >= eligibleLimit) return;

    const lapTime = result.FastestLap?.Time?.time;
    if (!lapTime) return;

    const [min, sec, ms] = lapTime.split(/[:.]/).map(Number);
    const totalMillis = (min * 60 * 1000) + (sec * 1000) + ms;

    if (fastestLapTime === null || totalMillis < fastestLapTime) {
      fastestLapTime = totalMillis;
      fastestLapDriverNumber = result.number;
    }
  });

  return fastestLapDriverNumber;
}