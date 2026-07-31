import { fetchOpenF1Json } from "../config/openf1";

export const fetchDriversAndTires = async (sessionKey) => {
  if (!sessionKey) return [];

  try {
    const [driversData, stintsData] = await Promise.all([
      fetchOpenF1Json("/drivers", { session_key: sessionKey }),
      fetchOpenF1Json("/stints", { session_key: sessionKey })
    ]);

    const stintsByDriver = stintsData.reduce((acc, { driver_number, lap_end, compound }) => {
      acc[driver_number] = acc[driver_number] || [];
      acc[driver_number].push({ lap_end, compound });
      return acc;
    }, {});

    return driversData.map(driver => ({
      ...driver,
      number: driver.driver_number,
      acronym: driver.name_acronym,
      tires: stintsByDriver[driver.driver_number] || []
    }));
  } catch (error) {
    console.error("Error fetching drivers and tires:", error);
    return [];
  }
};

function scaleCoordinates(x, y, scaleFactor) {
  return [x / scaleFactor, y / scaleFactor];
}

export async function fetchLocationData(sessionKey, driverId, startTime, endTime, scaleFactor = 100) {
  const [locationData, carData] = await Promise.all([
    fetchOpenF1Json("/location", {
      session_key: sessionKey,
      driver_number: driverId,
      "date>": startTime,
      "date<": endTime,
    }),
    fetchOpenF1Json("/car_data", {
      session_key: sessionKey,
      driver_number: driverId,
      "date>": startTime,
      "date<": endTime,
    })
  ]);

  locationData.sort((a, b) => new Date(a.date) - new Date(b.date));
  carData.sort((a, b) => new Date(a.date) - new Date(b.date));

  let carDataIndex = 0;
  return locationData.map(location => {
    const [scaledX, scaledY] = scaleCoordinates(location.x, location.y, scaleFactor);
    const locationDate = new Date(location.date);

    let closestCarData = carData[carDataIndex];
    let minTimeDiff = Math.abs(locationDate - new Date(closestCarData.date));

    for (let i = carDataIndex + 1; i < carData.length; i++) {
      const timeDiff = Math.abs(locationDate - new Date(carData[i].date));
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestCarData = carData[i];
        carDataIndex = i;
      } else {
        break;
      }
    }

    return {
      x: scaledX,
      y: scaledY,
      cardata: closestCarData,
    };
  });
}
