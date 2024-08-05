import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSelectComponent } from './Select';
import classNames from 'classnames';

export const ResultsSelector = ({ className, setSelectedYear, selectedYear, resultPage, resultPagePath, f1a }) => {
  const navigate = useNavigate();

  const [selectValue, setSelectValue] = useState(resultPage);
  const [internal, setInternal] = useState(false);

  useEffect(() => {
    setInternal(false);
    setSelectValue(resultPage);
  }, [resultPage]);

  const handleResultChange = (selectedOption) => {
    if (selectedOption.value === "") {
      navigate("/");
    } else {
      setInternal(true);
      setSelectValue(selectedOption.value);
      navigate(selectedOption.value);
    }
  };

  const generateYearOptions = (startYear) => {
    const years = [];
    let currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= startYear; year--) {
      years.push({ value: year, label: year.toString() });
    }
    return years;
  };

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption.value);
  };

  const resultsOptions = f1a ? [
    { value: '/f1a/race-results', label: 'Race results' },
    { value: '/f1a/constructor-standings', label: 'Constructor standings' },
    { value: '/f1a/driver-standings', label: 'Driver standings' }
  ] : [
    { value: '/race-results', label: 'Race results' },
    { value: '/constructor-standings', label: 'Constructor standings' },
    { value: '/driver-standings', label: 'Driver standings' }
  ];

  return (
    <div className={classNames(className, 'flex items-center justify-center gap-16 m-auto')}>
      <ReactSelectComponent
        placeholder="Select Year"
        options={generateYearOptions(2023)}
        onChange={handleYearChange}
        value={generateYearOptions(2023).find(option => option.value === selectedYear)}
        isSearchable={false}
        className="w-[17rem]"
      />
      <ReactSelectComponent
        placeholder="Select Result"
        options={resultsOptions}
        onChange={handleResultChange}
        isSearchable={false}
        value={internal ? resultsOptions.find(option => option.value === selectValue) : resultsOptions.find(option => option.value === resultPagePath)}
        className="w-[29rem]"
      />
    </div>
  );
};
