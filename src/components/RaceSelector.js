import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Select } from './Select';

export const RaceSelector = ({ races, selectedYear, onChange }) => {
  const navigate = useNavigate();

  const [selectValue, setSelectValue] = useState('');

  const handleRaceChange = (e) => {
      const race = races.find(r => r.meeting_name === e.target.value);
      setSelectValue(race.meeting_name);
      localStorage.setItem('selectValue', race.meeting_name);
      if (race) {
        navigate(
          `/race/${race.meeting_key}`, 
          { 
            state: { 
              raceName: race.meeting_name,
              meetingKey: race.meeting_key, 
              year: selectedYear, 
              location: race.location 
            }
          }
        );
      }
      onChange()
  };

  return (
    <Select label="Select Track" onChange={handleRaceChange} value={selectValue} disabled={!!races === false} fullWidth>
        <option value="">---</option>
        {races?.map((race) => (
          <option key={race.meeting_key} value={race.meeting_name}>{race.meeting_name}</option>
        ))}
    </Select>
  );
};