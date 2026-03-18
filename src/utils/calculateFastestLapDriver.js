export function calculateFastestLapDriver(results, eligibleLimit) {
  // Safety check for undefined or invalid results
  if (!results || !Array.isArray(results)) {
    return null;
  }

  let fastestLapTime = null;
  let fastestLapDriverNumber = null;

  results.forEach((result) => {
    const finishPosition = parseInt(result?.position, 10);
    const isEligiblePosition =
      Number.isFinite(finishPosition) &&
      finishPosition >= 1 &&
      finishPosition <= eligibleLimit;
    if (!isEligiblePosition) return;

    const lapTime = result.FastestLap?.Time?.time;
    if (!lapTime) return;

    const [min, sec, ms = 0] = lapTime.split(/[:.]/).map(Number);
    if (![min, sec, ms].every(Number.isFinite)) return;
    const totalMillis = (min * 60 * 1000) + (sec * 1000) + ms;

    if (fastestLapTime === null || totalMillis < fastestLapTime) {
      fastestLapTime = totalMillis;
      fastestLapDriverNumber = result.number;
    }
  });

  return fastestLapDriverNumber;
}