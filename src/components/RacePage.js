import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function RacePage() {
  const { state } = useLocation();
  const { raceName, meetingKey, year } = state || {};
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchSessionKey = async () => {
      try {
        const sessionsResponse = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`);
        if (!sessionsResponse.ok) throw new Error('Failed to fetch sessions');
        const sessionsData = await sessionsResponse.json();
        const raceSession = sessionsData.find(session => session.session_name === "Race");
        if (!raceSession) throw new Error('Race session not found');
        return raceSession.session_key;
      } catch (error) {
        console.error("Error fetching session key:", error);
      }
    };

    const fetchDriversAndTires = async () => {
      try {
        const sessionKey = await fetchSessionKey();
        if (!sessionKey) return;
        const driversResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);
        if (!driversResponse.ok) throw new Error('Failed to fetch drivers');
        let driversData = await driversResponse.json();

        const stintsResponse = await fetch(`https://api.openf1.org/v1/stints?session_key=${sessionKey}`);
        if (!stintsResponse.ok) throw new Error('Failed to fetch stints');
        const stintsData = await stintsResponse.json();

        // Grouping stints by driver_number
        const stintsByDriver = stintsData.reduce((acc, stint) => {
          const { driver_number, lap_end, compound } = stint;
          if (!acc[driver_number]) {
            acc[driver_number] = [];
          }
          acc[driver_number].push({ lap_end, compound });
          return acc;
        }, {});

        // Adding tire data to drivers
        driversData = driversData.map(driver => ({
          ...driver,
          number: driver.driver_number,
          acronym: driver.name_acronym,
          tires: stintsByDriver[driver.driver_number] || [],
        }));

        setDrivers(driversData);
      } catch (error) {
        console.error("Error fetching drivers and tires:", error);
      }
    };

    if (meetingKey) {
      fetchDriversAndTires();
    }
  }, [meetingKey]); // Rerun when meetingKey changes

  return (
    <div>
      <h2>Race Details</h2>
      {raceName && <p>Race Name: {raceName} {year}</p>}
      {meetingKey && <p>Meeting Key: {meetingKey}</p>}
      <h3>Tire Strategy</h3>
      <ul>
        {drivers.map((driver, index) => (
          <li key={index}>
            Driver Number: {driver.number}, Acronym: {driver.acronym}
            <ul>
              {driver.tires?.map((tire, tireIndex) => (
                <li key={tireIndex}>Lap End: {tire.lap_end}, Compound: {tire.compound}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
