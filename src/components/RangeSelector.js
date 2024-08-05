import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { ReactSelectComponent } from './Select';
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

    const race1name = raceDetails ? start > 0 && raceDetails.find(race => (race.round === start)).raceName : ''
    const race2name = raceDetails ? end > 0 && raceDetails.find(race => (race.round === end)).raceName : ''

    return (
        <><div className={classNames(className,"flex flex-col items-center z-[2] relative bg-glow-dark p-16 rounded-lg mb-48")}>
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
                    <ReactSelectComponent 
                        placeholder="Select Start Race"
                        options={raceDetails ? raceDetails.map(race => ({value: race.round, label: race.raceName})) : ''}
                        onChange={handleStartChange}
                        className="w-full md:w-[30rem]"
                    />
                    <ReactSelectComponent 
                        placeholder="Select End Race"
                        options={raceDetails ? raceDetails.map(race => ({value: race.round, label: race.raceName})).filter(x => (parseInt(x.value) > parseInt(start))) : ''}
                        onChange={(selectedOption) => setEnd(selectedOption.value)}
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
        {(race1name && race2name) && (
            <div className="flex justify-center gap-16 px-8 items-center">
                <div className="text-right w-1/2">
                    <div className="text-neutral-400 text-sm leading-[1]">Round {start}</div>
                    <div className="font-display">{race1name.replace(/Grand Prix/g, "GP")}</div>
                </div>
                <div>-</div>
                <div className="w-1/2">
                    <div className="text-neutral-400 text-sm leading-[1]">Round {end}</div>
                    <div className="font-display">{race2name.replace(/Grand Prix/g, "GP")}</div>
                </div>
            </div>
        )} 
        </>
    );
};