import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchDriversAndTires } from '../utils/api'; // Adjust the import path as needed

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

    const fetchData = async () => {
      try {
        const sessionKey = await fetchSessionKey();
        const driversData = await fetchDriversAndTires(sessionKey);
        setDrivers(driversData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (meetingKey) {
      fetchData();
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