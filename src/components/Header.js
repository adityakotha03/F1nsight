import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ReactComponent as Logo} from './f1nsight.svg';
import { Select } from './Select';
import { RaceSelector } from './RaceSelector';
import { fetchRacesAndSessions } from '../utils/api';

export const Header = ({ setResultPage, setResultPagePath }) => {

    const [races, setRaces] = useState([]);
    const [selectedYear, setSelectedYear] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const navRef = useRef(null);
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

    const currentYear = new Date().getFullYear();
    const generateYears = (startYear) => {
        const years = [];
        for (let year = currentYear; year >= startYear; year--) {
          years.push(year);
        }
        return years;
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const raceSelectorContent = (
        <>
            <Select className="mb-8" label="Year" value={selectedYear} onChange={handleYearChange} fullWidth>
                <option value="">---</option>
                {generateYears(2023).map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </Select>
            <RaceSelector 
                races={races} 
                selectedYear={selectedYear} 
                onChange={toggleOpen}
            />
        </>
    )

    const disableClick = (e) => {
        e.preventDefault();
    }
    
    const comparisonContent = (
        <>
            <NavLink to="/driver-comparison" className="block px-4 py-2 text-neutral-300 hover:text-white" onClick={toggleOpen}>Driver Comparison</NavLink>
            <NavLink to="/teammates-comparison" className="block px-4 py-2 text-neutral-300 hover:text-white" onClick={toggleOpen}>Teammates Comparison</NavLink>
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
                }}
                >Race Results</NavLink>
            <NavLink 
                to="/constructor-standings" 
                className="block px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    handleNavLinkClick('Constructor Standings')
                    toggleOpen()
                }} 
                >Constructor Standings</NavLink>
            <NavLink 
                to="/driver-standings" 
                className="block px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    handleNavLinkClick('Driver Standing')
                    toggleOpen()
                }}
                >Driver Standings</NavLink>
        </>
    )
    
    return (
        <>
        <header className="global-header" ref={headerRef}>
            <div className="global-header__main-nav shadow-lg bg-glow bg-neutral-800/90 backdrop-blur-sm uppercase tracking-xs text-sm " >

                <div className="global-header__main-nav__left">
                    <a href="/"><Logo height={48} /></a>
                </div>

                {/* Mobile */}
                <button className="md:hidden p-8" onClick={toggleOpen}>
                    <FontAwesomeIcon icon="bars" className="fa-2x" />
                </button>
                
                {/* Desktop */}
                <div className="flex items-center gap-16 max-md:hidden">
                    <div className="relative group w-max">
                        <button className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase">
                            Results
                            <FontAwesomeIcon icon="chevron-down" className='global-header__main-nav__button__icon' />
                        </button>
                        <div className="absolute right-1 -mt-2 pt-12 w-max hidden group-hover:block">
                            <div className="flex flex-col gap-8 p-16 rounded-md bg-glow bg-neutral-800 shadow-lg">
                                {resultsContent}
                            </div>
                        </div>
                    </div>
                    <div className="relative group w-max">
                        <button className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase">
                            Comparisons
                            <FontAwesomeIcon icon="chevron-down" className='global-header__main-nav__button__icon' />
                        </button>
                        <div className="absolute right-1 -mt-2 pt-12 w-max hidden group-hover:block">
                            <div className="flex flex-col gap-8 p-16 rounded-md bg-glow bg-neutral-800 shadow-lg">
                                {comparisonContent}
                            </div>
                        </div>
                    </div>
                    <div className="relative group w-max">
                        <button className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase">Race Viewer</button>
                        <div className="absolute right-1 -mt-2 pt-12 w-max hidden group-hover:block min-w-[20rem]">
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
                    <div className="flex flex-col gap-16">
                        {resultsContent}
                    </div>
                    <p className="font-display tracking-xs my-16 mt-32">Comparisons</p>
                    <div className="flex flex-col gap-16">
                        {comparisonContent}
                    </div>
                    <p className="font-display tracking-xs my-16 mt-32">Race Viewer</p>
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