import { buildF1nsightApiUrl, fetchJsonWithCache } from "./client";

export const fetchDriversList = async () => {
  const response = await fetchJsonWithCache(buildF1nsightApiUrl("/driversList.json"));
  return response.map(driver => ({
    id: driver.driverId,
    name: `${driver.givenName} ${driver.familyName}`
  }));
};

export const fetchDriverStats = async (driverId1, driverId2) => {
  const fetchDriverData = async (driverId) => {
    try {
      const dataResponse = await fetch(buildF1nsightApiUrl(`/drivers/${driverId}.json`));
      if (dataResponse.ok) {
        return dataResponse.json();
      }
      console.log("Failed to fetch data");
    } catch (error) {
      console.log(error);
    }
  };

  const driverData1 = await fetchDriverData(driverId1);
  const driverData2 = await fetchDriverData(driverId2);
  return { driver1: driverData1, driver2: driverData2 };
};
