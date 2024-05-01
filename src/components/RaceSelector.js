import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from './Select';

export const RaceSelector = ({ races, selectedYear, setIsRaceSelected }) => {
  const navigate = useNavigate();

  console.log(races)

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
    <Select label="Race" onChange={handleRaceChange}>
        <option value="">---</option>
        {races.map((race) => (
          <option key={race.meeting_key} value={race.meeting_name}>{race.meeting_name}</option>
      ))}
    </Select>
  );
};
