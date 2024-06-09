import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from './Select';

export const RaceSelector = ({ races, selectedYear, pagePath, setIsRaceSelected, isRaceSelected }) => {
  const navigate = useNavigate();

  const [selectValue, setSelectValue] = useState(localStorage.getItem('selectValue') || '');

  const handleRaceChange = (e) => {
    if (e.target.value === "") {
      setIsRaceSelected(false);
      navigate(pagePath);
    } else {
      setIsRaceSelected(true);
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
    }
  };

  useEffect(() => {
    if (!isRaceSelected) { 
      setSelectValue('');
      localStorage.removeItem('selectValue');
    };
  }, [isRaceSelected]);

  return (
    <Select label="Select Track" onChange={handleRaceChange} value={selectValue}>
        <option value="">---</option>
        {races.map((race) => (
          <option key={race.meeting_key} value={race.meeting_name}>{race.meeting_name}</option>
        ))}
    </Select>
  );
};