import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as Logo} from './f1nsight.svg';

export const Header = (props) => {
    const { children } = props;
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleNavLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <header className="fixed -top-1 w-full z-[100]">
            <div className="flex flex-col items-start sm:items-center sm:flex-row sm:justify-between gap-8 py-8 px-16 shadow-lg bg-glow bg-neutral-800/90 backdrop-blur-sm">
                <div className="flex item-center gap-16 max-sm:justify-between max-sm:w-full">
                    <a href="/"><Logo height={48}/></a>
                    <button 
                        className="text-sm tracking-xs uppercase cursor-pointer pt-18" 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                    >
                        Results 
                        <FontAwesomeIcon 
                            icon="caret-down"
                            className={classNames("fa-xs ml-4", {'fa-rotate-180' : isOpen})} 
                        />
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row max-sm:w-full gap-8">
                    {children}
                </div>
            </div>
            <nav 
                className="
                    flex flex-col sm:flex-row items-center justify-center 
                    gap-16 sm:gap-32 py-48 shadow-xl 
                    border-b-2 border-neutral-800 bg-neutral-900/90 backdrop-blur-sm
                    heading-4 absolute w-full ease-in-out duration-300"
                style={{
                    opacity: isOpen ? '1' : '0',
                    pointerEvents: isOpen ? 'initial' : 'none' 
                }}
                ref={navRef}
            >
                <NavLink activeclassname="active" className="navLink" to="/" onClick={handleNavLinkClick}>Race Results</NavLink>
                <NavLink activeclassname="active" className="navLink" to="/constructor-standings" onClick={handleNavLinkClick}>Constructor Standings</NavLink>
                <NavLink activeclassname="active" className="navLink" to="/driver-standings" onClick={handleNavLinkClick}>Driver Standings</NavLink>
            </nav>
        </header>
    );
};