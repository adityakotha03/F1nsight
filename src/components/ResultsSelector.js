import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Select } from './Select';
import classNames from 'classnames';
import { fetchRaceDetails } from '../utils/api';

export const ResultsSelector = ({ className, setSelectedYear, selectedYear, resultPage, resultPagePath, f1a }) => {
  const navigate = useNavigate();

  const [selectValue, setSelectValue] = useState(resultPage);
  const [internal, setInternal] = useState(resultPage);

  useEffect(() => {
    setInternal(false);
    setSelectValue(resultPage);
  }, [resultPage]);

  const handleResultChange = (e) => {
    if (e.target.value === "") {
      navigate("/");
    } else {
      setInternal(true);
      setSelectValue(e.target.value);
      navigate(
        e.target.value, 
      );
    }
  };

  const generateYears = (startYear) => {
      const years = [];
      let currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= startYear; year--) {
        years.push(year);
      }
      return years;
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className={classNames(className, 'flex items-center justify-center gap-16 m-auto')}>
      <Select label="Year" value={selectedYear} onChange={handleYearChange}>
          {generateYears(2023).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
      </Select>
      <Select label="Select Result" onChange={handleResultChange} value={internal ? selectValue : resultPagePath}>
          <option value={f1a ? "/f1a/race-results" : "/race-results"}>Race results</option>
          <option value={f1a ? "/f1a/constructor-standings" : "/constructor-standings"}>Constructor standings</option>
          <option value={f1a ? "/f1a/driver-standings" : "/driver-standings"}>Driver standings</option>
      </Select>
    </div>
  );
};