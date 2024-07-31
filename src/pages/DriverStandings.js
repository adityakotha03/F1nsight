import React, { useEffect, useState } from 'react';
import { fetchRaceDetails, getDriverStandings, getPartialDriverStandings } from '../utils/api';

import { ConstructorDriver, Loading } from '../components';
import Select from 'react-select';

export function DriverStandings({ selectedYear }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [raceDetails, setRaceDetails] = useState(null);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getDriverStandings(selectedYear);
      const data2 = await fetchRaceDetails(selectedYear);
      setRaceDetails(data2.filter(race => (race.url)))
      setStandings(data);
      console.log(data);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear, reset]);

  useEffect(() => {
    const alterStandings = async () => {
      setIsLoading(true);
      if(parseInt(start)<parseInt(end) && start!==-1 && end!==-1){
        const data = await getPartialDriverStandings(selectedYear, start, end);
        console.log(data);
        setStandings(data);
      }
      setIsLoading(false);
    }
    alterStandings();
  }, [start, end]);

  const handleStartChange = (start) => {
    setStart(start);
    setEnd(-1);
  }
  
  const handleReset = () => {
    setStart(-1);
    setEnd(-1);
    setReset(!reset);
  }
  const customStyles = {
    option: (provided) => ({
        ...provided,
        color: 'black'
    }),
    control: (baseStyles, state) => ({
        ...baseStyles,
        borderColor: state.isFocused ? '#e5e5e5' : '#737373',
        background: 'rgb(38 38 38 / 0.1)',
        boxShadow: 'inset 0 0 2.4rem 0 rgba(255, 255, 255, .25), 0 0 2.4rem 0 rgba(0, 0, 0, .55)',
        color: '#f1f1f1',
        borderRadius: '1.2rem',
        padding: '.8rem',
    }),
    input: (styles, state) => ({
        ...styles,
        color: '#f1f1f1',
    }),
    placeholder: (styles) => ({ 
        ...styles, 
        color: '#cccccc',
    }),
    singleValue: (styles) => ({ 
        ...styles, 
        color: '#f1f1f1',
    }),
  };

  return (
    <div className="max-w-[120rem] m-auto">
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Driver Standings`} />
      ) : (
        <div>
          <div className="flex max-md:flex-col justify-center items-center gap-16 z-[2] relative">
          <Select 
            placeholder = {start===-1 ? "Select Start Race" : (raceDetails ? raceDetails.find(race => (race.round===start)).raceName : '')}
            options={raceDetails ? raceDetails.map(race => ({value: race.round, label: race.raceName})) : ''}
            onChange = {(selectedOption) => handleStartChange(selectedOption.value)}
            styles={customStyles}
            className="w-full md:w-[30rem]"
          />
          <Select 
            placeholder = {end===-1 ? "Select End Race" : (raceDetails ? raceDetails.find(race => (race.round===end)).raceName : '')}
            options={raceDetails ? raceDetails.map(race => ({value: race.round, label: race.raceName})).filter(x => (parseInt(x.value) > parseInt(start))) : ''}
            onChange = {(selectedOption) => setEnd(selectedOption.value)}
            styles={customStyles}
            className="w-full md:w-[30rem]"
          />
          <button onClick={() => handleReset()}>Reset</button>
        </div>
          <ul>
            {standings.map((standing, index) => (
              <li key={index} className='w-full'>
                <ConstructorDriver 
                className="mt-32"
                  image={standing.driverCode} 
                  car={standing.constructorId}
                  points={standing.points}
                  firstName={standing.firstName}
                  lastName={standing.lastName}
                  year={selectedYear} 
                  showDivider
                  index={index}
                  showStanding
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
