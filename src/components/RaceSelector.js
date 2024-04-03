import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RaceSelector = ({ races, selectedYear, setIsRaceSelected }) => {
  const navigate = useNavigate();

  const handleRaceChange = (e) => {
    if (e.target.value === "") {
      setIsRaceSelected(false);
      navigate('/');
    } else {
      setIsRaceSelected(true);
      const race = races.find(r => r.meeting_name === e.target.value);
      if (race) {
        navigate(`/race/${race.meeting_key}`, { state: { raceName: race.meeting_name, meetingKey: race.meeting_key, year: selectedYear, country: race.country_name } });
      }
    }
  };

  return (
    <select onChange={handleRaceChange} className="bg-glow gradient-border bg-transparent">
      <option value="">Select a Race</option>
      {races.map((race) => (
        <option key={race.meeting_key} value={race.meeting_name}>{race.meeting_name}</option>
      ))}
    </select>
  );
};
