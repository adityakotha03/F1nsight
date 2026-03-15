import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactSelectComponent } from './Select';

export const RaceSelector = ({ races, selectedYear, onChange }) => {
  const navigate = useNavigate();

  const [selectValue, setSelectValue] = useState('');

  const handleRaceChange = (selectedOption) => {
      const race = races.find(r => r.meeting_name === selectedOption.value);
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

  const raceOptions = races.map(race => ({
    value: race.meeting_name,
    label: race.meeting_name,
  }));

  return (
    <ReactSelectComponent
      placeholder="Select Track"
      options={raceOptions}
      onChange={handleRaceChange}
      value={raceOptions.find(option => option.value === selectValue)}
      isDisabled={!races.length}
      className="w-full"
      isSearchable={false}
    />
  );
};