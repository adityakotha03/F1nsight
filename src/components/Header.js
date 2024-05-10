import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as Logo} from './f1nsight.svg';
import { Select } from './Select';

import { RaceSelector } from './RaceSelector';

export const Header = (props) => {
    const { setSelectedYear, selectedYear, currentYear } = props;

    const [subNavOpenOpen, setSubNavOpen] = useState(false);
    const [page, setPage] = useState('Race Results');
    const [races, setRaces] = useState([]);
    const [isRaceSelected, setIsRaceSelected] = useState(false);

    const navRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setSubNavOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        const fetchRaces = async () => {
        const response = await fetch(`https://api.openf1.org/v1/meetings?year=${selectedYear}`);
        if (response.ok) {
            const data = await response.json();
            setRaces(data);
        }
        };

        fetchRaces();
    }, [selectedYear]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const generateYears = (startYear) => {
        const years = [];
        for (let year = currentYear; year >= startYear; year--) {
          years.push(year);
        }
        return years;
    };

    const handleNavLinkClick = (page) => {
        setSubNavOpen(false);
        setPage(page)
        setIsRaceSelected(false)
    };

    return (
        <header className="global-header">
            <div className="global-header__main-nav shadow-lg bg-glow bg-neutral-800/90 backdrop-blur-sm">

                <div className="global-header__main-nav__left">
                    <a href="/"><Logo height={48}/></a>
                    <Select label="Year" value={selectedYear} onChange={handleYearChange}>
                        {generateYears(2023).map((year) => (
                        <option key={year} value={year}>{year}</option>
                        ))}
                    </Select>
                </div>

                <div className="global-header__main-nav__right">
                    <button 
                        className="select select--style-for-button text-left max-md:w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSubNavOpen(!subNavOpenOpen);
                        }}
                    >
                        <div className="select__input bg-glow bg-neutral-800/10 leading-none min-w-[18rem]">
                            {isRaceSelected ? '---' : page}
                        </div>
                        <div className="select__label tracking-xs uppercase">
                            Season Results
                        </div>
                    </button>
                    <RaceSelector 
                        races={races} 
                        selectedYear={selectedYear} 
                        setIsRaceSelected={setIsRaceSelected} 
                        isRaceSelected={isRaceSelected}
                        page={page}
                    />
                </div>
            </div>

            <nav 
                className="global-header__sub-nav text-center
                    border-b-2 border-neutral-800 bg-neutral-900/90 backdrop-blur-sm shadow-xl
                    ease-in-out duration-300 uppercase tracking-xs"
                style={{
                    opacity: subNavOpenOpen ? '1' : '0',
                    pointerEvents: subNavOpenOpen ? 'initial' : 'none',
                    height: subNavOpenOpen ? 'inherit' : '1rem', 
                }}
                ref={navRef}
            >
                <NavLink activeclassname="active" className="navLink" to="/" onClick={() => handleNavLinkClick('Race Results')}>Race Results</NavLink>
                <NavLink activeclassname="active" className="navLink" to="/constructor-standings" onClick={() => handleNavLinkClick('Constructor Standings')}>Constructor Standings</NavLink>
                <NavLink activeclassname="active" className="navLink" to="/driver-standings" onClick={() => handleNavLinkClick('Driver Standing')}>Driver Standings</NavLink>
            </nav>
        </header>
    );
};