import React, { useEffect, useState } from 'react';
import { fetchRaceDetails, getConstructorStandings, getPartialConstructorStandings } from '../utils/api';
import Select from 'react-select';

import { ConstructorCar, Loading } from '../components';
import { useNavigate } from 'react-router-dom';

export function ConstructorStandings({ selectedYear }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [raceDetails, setRaceDetails] = useState(null);
  const [reset, setReset] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getConstructorStandings(selectedYear);
      const data2 = await fetchRaceDetails(selectedYear);
      const data3 = data2.filter(race => (race.url))
      setRaceDetails(data3);
      console.log(data3);
      setStandings(data);
      // console.log(data);
      // setEnd(data3.length);
      // setFilteredStandings(data);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear, reset]);

  useEffect(() => {
    const alterStandings = async () => {
      setIsLoading(true);
      if(parseInt(start)<parseInt(end) && start!==-1 && end!==-1){
        const data = await getPartialConstructorStandings(selectedYear,start,end);
        setStandings(data);
      }
      setIsLoading(false);
    }

    alterStandings();
  }, [start,end]);

  let navigate = useNavigate();
  const navigateToTeamComp = (constructorId) => {
    navigate(
      `/teammates-comparison/${selectedYear}/${constructorId}`
    );
  };

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
    <div className="max-w-[45rem] m-auto">
      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Loading ${selectedYear} Constructor Standings`} />
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
          <li key={index} className='clickable-hover' onClick={()=> {navigateToTeamComp(standing.constructorId)}}>
            <ConstructorCar 
              image={standing.constructorId} 
              points={standing.points}
              name={standing.constructorName}
              year={selectedYear} 
              drivers={standing.driverCodes}
              index={index}
            />
          </li>
        ))}
      </ul>
      </div>
      )}
    </div>
  );
}
