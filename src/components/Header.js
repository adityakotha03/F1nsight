import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ReactComponent as Logo} from './f1nsight.svg';
import { ReactSelectComponent } from './Select';
import { RaceSelector } from './RaceSelector';
import { fetchRacesAndSessions } from '../utils/api';
import { trackButtonClick } from '../utils/gaTracking';

export const Header = ({ setResultPage, setResultPagePath }) => {

    const [races, setRaces] = useState([]);
    const [selectedYear, setSelectedYear] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [raceViewerDropdownOpen, setRaceViewerDropdownOpen] = useState(false);

    const raceViewerRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        if (selectedYear.length > 0) {
            const fetchData = async () => {
                const data = await fetchRacesAndSessions(selectedYear);
                setRaces(data);
            };
          
            fetchData();
        }
    }, [selectedYear]);

    const handleClickOutside = (event) => {
        if (raceViewerRef.current && !raceViewerRef.current.contains(event.target)) {
            setRaceViewerDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavLinkClick = (page) => {
        setResultPage(page);
        if (page === 'Race Results') {
            setResultPagePath('/race-results');
        } else if (page === 'Constructor Standings') {
            setResultPagePath('/constructor-standings');
        } else if (page === 'Driver Standing') {
            setResultPagePath('/driver-standings');
        }
    };
    
    const generateYears = (startYear) => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= startYear; year--) {
          years.push({ value: year.toString(), label: year.toString() });
        }
        return years;
    };

    const yearOptions = generateYears(2023);

    const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption.value);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const raceSelectorContent = (
        <>
            <ReactSelectComponent
                placeholder="Select Year"
                options={yearOptions}
                onChange={handleYearChange}
                value={yearOptions.find(option => option.value === selectedYear)}
                className="w-full mb-8"
                isSearchable={false}
            />
            <RaceSelector 
                races={races} 
                selectedYear={selectedYear} 
                onChange={() => {
                    setRaceViewerDropdownOpen(false)
                    setIsOpen(false)
                }}
            />
        </>
    )
    
    const comparisonContent = (
        <>
            <NavLink 
                to="/driver-comparison" 
                className="block px-4 py-2 text-neutral-300 hover:text-white" 
                onClick={() => {
                    toggleOpen()
                    trackButtonClick('Driver Comparison')}}
            >
                Driver Comparison
            </NavLink>
            <NavLink 
                to="/teammates-comparison" 
                className="block px-4 py-2 text-neutral-300 hover:text-white" 
                onClick={() => {
                    toggleOpen()
                    trackButtonClick('Teammates Comparison')
                }}
            >
                Teammates Comparison
            </NavLink>
        </>
    )
    const resultsContent = (
        <>
             <NavLink 
                to="/race-results" 
                className="block px-4 py-2 text-neutral-300 hover:text-white" 
                onClick={() => {
                    handleNavLinkClick('Race Results')
                    toggleOpen()
                    trackButtonClick('Race Results')
                }}
                >Race Results</NavLink>
            <NavLink 
                to="/constructor-standings" 
                className="block px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    handleNavLinkClick('Constructor Standings')
                    toggleOpen()
                    trackButtonClick('Constructor Standings')
                }} 
                >Constructor Standings</NavLink>
            <NavLink 
                to="/driver-standings" 
                className="block px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    handleNavLinkClick('Driver Standing')
                    toggleOpen()
                    trackButtonClick('Driver Standings')
                }}
                >Driver Standings</NavLink>
        </>
    )
    
    return (
        <>
        <header className="global-header" ref={headerRef}>
            <div className="global-header__main-nav shadow-lg bg-glow bg-neutral-800/90 backdrop-blur-sm" >

                <div className="global-header__main-nav__left flex items-center gap-32">
                    <a href="/"><Logo height={48} /></a>
                </div>

                {/* Mobile */}
                <button className="md:hidden p-8" onClick={toggleOpen}>
                    <FontAwesomeIcon icon="bars" className="fa-2x" />
                </button>
                
                {/* Desktop */}
                <div className="flex items-center gap-16 max-md:hidden">
                    <div className="relative group w-max uppercase tracking-xs text-sm ">
                        <button className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase">
                            Results
                            <FontAwesomeIcon icon="chevron-down" className='global-header__main-nav__button__icon opacity-0 group-hover:opacity-100' />
                        </button>
                        <div className="absolute right-1 -mt-2 pt-12 w-max hidden group-hover:block">
                            <div className="flex flex-col gap-8 p-16 rounded-md bg-glow bg-neutral-800 shadow-lg">
                                {resultsContent}
                            </div>
                        </div>
                    </div>
                    <div className="relative group w-max uppercase tracking-xs text-sm ">
                        <button className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase">
                            Comparisons
                            <FontAwesomeIcon icon="chevron-down" className='global-header__main-nav__button__icon opacity-0 group-hover:opacity-100' />
                        </button>
                        <div className="absolute right-1 -mt-2 pt-12 w-max hidden group-hover:block">
                            <div className="flex flex-col gap-8 p-16 rounded-md bg-glow bg-neutral-800 shadow-lg">
                                {comparisonContent}
                            </div>
                        </div>
                    </div>
                    <div className="relative w-max" ref={raceViewerRef}>
                        <button className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase tracking-xs text-sm " onClick={() => setRaceViewerDropdownOpen(!raceViewerDropdownOpen)}>
                            Race Viewer
                            <FontAwesomeIcon icon="chevron-down" className={classNames('global-header__main-nav__button__icon opacity-0', {"opacity-100": raceViewerDropdownOpen})} />
                        </button>
                        <div className={classNames("absolute right-1 -mt-2 pt-12 w-max min-w-[20rem]", raceViewerDropdownOpen ? 'block' : 'hidden' )}>
                            <div className="flex flex-col p-16 rounded-md bg-glow bg-neutral-800 shadow-lg">
                                {raceSelectorContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* Mobile */}
        {isOpen && (
            <div className="fixed top-[0] left-[0] w-full h-full bg-glow bg-neutral-900/95 backdrop-blur-sm md:hidden z-[1001] text-[2rem]">
                <button className="absolute top-8 right-16 p-8" onClick={toggleOpen}>
                    <FontAwesomeIcon icon="xmark" className="fa-2x" />
                </button>
                <div className="pt-64 px-32">
                    <p className="font-display tracking-xs my-16">Results</p>
                    <div className="flex flex-col gap-16 ml-8">
                        {resultsContent}
                    </div>
                    <p className="font-display tracking-xs my-16">Comparisons</p>
                    <div className="flex flex-col gap-16  ml-8">
                        {comparisonContent}
                    </div>
                    <p className="font-display tracking-xs my-16">Race Viewer</p>
                    <div className="flex flex-col gap-16">
                        {raceSelectorContent}
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

Header.propTypes = {
    setResultPage: PropTypes.func.isRequired,
    setResultPagePath: PropTypes.func.isRequired,
};