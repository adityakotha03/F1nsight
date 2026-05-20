import { buildF1nsightApiUrl } from "./client";

export const fetchRaceResultsByCircuit = async (year, circuitId) => {
  try {
    const response = await fetch(buildF1nsightApiUrl(`/races/${year}/results.json`));
    const data = await response.json();
    const results = data.find(element => element.Circuit.circuitId === circuitId).Results;
    return results || [];
  } catch (error) {
    console.error("Error fetching race results:", error);
    return [];
  }
};

export const fetchQualifyingResultsByCircuit = async (year, circuitId) => {
  try {
    const response = await fetch(buildF1nsightApiUrl(`/races/${year}/qualifying.json`));
    const data = await response.json();
    const results = data.find(element => element.Circuit.circuitId === circuitId).QualifyingResults;
    return results || [];
  } catch (error) {
    console.error("Error fetching qualifiying results:", error);
    return [];
  }
};
