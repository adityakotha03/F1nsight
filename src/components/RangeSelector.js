import React, { useState } from 'react';
import Select from 'react-select';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { customSelectStyles } from './Select';
import { Button } from './Button';
import classNames from 'classnames';

export const RangeSelector = (props) => {
    const { 
        start, 
        end, 
        reset,
        setStart,
        setEnd, 
        setReset,
        raceDetails, 
        className,
        rangeOpen,
    } = props;

    const [isOpen, setIsOpen] = useState(rangeOpen);

    const handleStartChange = (selectedOption) => {
        setStart(selectedOption.value);
        setEnd(-1);
    };
      
    const handleReset = () => {
        setStart(-1);
        setEnd(-1);
        setReset(!reset);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={classNames(className,"flex flex-col items-center z-[2] relative bg-glow-dark p-16 rounded-lg mb-48")}>
            <button 
                onClick={toggleOpen}
                className="flex items-center gap-8 text-lg font-semibold"
            >
                <span>Select Range</span>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            
            <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-[0] overflow-hidden'}`}
            >
                <div className="flex max-md:flex-col justify-center items-center gap-16 z-[2] relative p-16">
                    <Select 
                        placeholder={start === -1 ? "Select Start Race" : (raceDetails ? raceDetails.find(race => (race.round === start)).raceName : '')}
                        options={raceDetails ? raceDetails.map(race => ({value: race.round, label: race.raceName})) : ''}
                        onChange={handleStartChange}
                        styles={customSelectStyles}
                        className="w-full md:w-[30rem]"
                    />
                    <Select 
                        placeholder={end === -1 ? "Select End Race" : (raceDetails ? raceDetails.find(race => (race.round === end)).raceName : '')}
                        options={raceDetails ? raceDetails.map(race => ({value: race.round, label: race.raceName})).filter(x => (parseInt(x.value) > parseInt(start))) : ''}
                        onChange={(selectedOption) => setEnd(selectedOption.value)}
                        styles={customSelectStyles}
                        className="w-full md:w-[30rem]"
                    />
                </div>
                <Button 
                    onClick={handleReset} 
                    size='sm'
                    className={`mx-auto mt-8 -mb-32`}
                >
                    Reset
                </Button>
            </div>
        </div>
    );
};