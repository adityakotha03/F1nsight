export const organizeQualifyingResults = (raceResults) => {
    // Helper function to convert time strings to seconds for comparison
    const timeToSeconds = (time) => {
      const [minutes, seconds] = time.split(':').map(parseFloat);
      return minutes * 60 + seconds;
    };
  
    // Helper function to sort drivers by qualifying times for a given key
    const sortByQualifyingTime = (drivers, qualiKey) => {
      return drivers
        .filter(driver => driver[qualiKey] !== undefined) // Ensure the driver has qualifying times
        .sort((a, b) => timeToSeconds(a[qualiKey]) - timeToSeconds(b[qualiKey]));
    };
  
    // Organize Q1 results
    const q1Results = sortByQualifyingTime(raceResults, 'Q1');
  
    // Organize Q2 results
    const q2Results = sortByQualifyingTime(raceResults, 'Q2')
      .filter(driver => driver.Q1 !== undefined); // Ensure they participated in Q1
  
    // Organize Q3 results
    const q3Results = sortByQualifyingTime(raceResults, 'Q3')
      .filter(driver => driver.Q2 !== undefined); // Ensure they participated in Q2
  
    return { q1Results, q2Results, q3Results };
  };