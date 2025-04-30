import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ReactComponent as Logo } from "./f1nsight-outlined.svg";
import { ReactSelectComponent } from "./Select";
import { RaceSelector } from "./RaceSelector";
import { fetchRacesAndSessions } from "../utils/api";
import { trackButtonClick } from "../utils/gaTracking";
import { Modal } from "./Modal";
import { F1ALinks, F1Links, F2Links } from "./Links";

export const Header = ({ setResultPage, setResultPagePath }) => {
    const [races, setRaces] = useState([]);
    const [selectedYear, setSelectedYear] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [headerOpen, setHeaderOpen] = useState(false);
    const [raceViewerDropdownOpen, setRaceViewerDropdownOpen] = useState(false);

    const raceViewerRef = useRef(null);
    const headerRef = useRef(null);

    const location = useLocation().pathname;
    const collapsible = location.startsWith("/race/");

    // console.log(collapsible ? "collapsible" : "not collapsible");
    // console.log(headerOpen ? "headerOpen" : "not headerOpen");

    useEffect(() => {
        const handleResize = () => {
            setHeaderOpen(window.innerWidth > 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
        if (
            raceViewerRef.current &&
            !raceViewerRef.current.contains(event.target)
        ) {
            setRaceViewerDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNavLinkClick = (page) => {
        setResultPage(page);
        if (page === "Race Results") {
            setResultPagePath("/race-results");
        } else if (page === "Constructor Standings") {
            setResultPagePath("/constructor-standings");
        } else if (page === "Driver Standing") {
            setResultPagePath("/driver-standings");
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
                value={yearOptions.find(
                    (option) => option.value === selectedYear
                )}
                className="w-full mb-8"
                isSearchable={false}
            />
            <RaceSelector
                races={races}
                selectedYear={selectedYear}
                onChange={() => {
                    setRaceViewerDropdownOpen(false);
                    setIsOpen(false);
                }}
            />
        </>
    );

    const comparisonContent = (
        <>
            <NavLink
                to="/driver-comparison"
                className="block uppercase tracking-xs px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    isOpen && setIsOpen(false);
                    trackButtonClick("Driver Comparison");
                }}
            >
                Driver Comparison
            </NavLink>
            <NavLink
                to="/teammates-comparison"
                className="block uppercase tracking-xs px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    isOpen && setIsOpen(false);
                    trackButtonClick("Teammates Comparison");
                }}
            >
                Teammates Comparison
            </NavLink>
        </>
    );
    const resultsContent = (
        <>
            <NavLink
                to="/race-results"
                className="block uppercase tracking-xs px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    handleNavLinkClick("Race Results");
                    isOpen && setIsOpen(false);
                    trackButtonClick("Race Results");
                }}
            >
                Race Results
            </NavLink>
            <NavLink
                to="/constructor-standings"
                className="block uppercase tracking-xs px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    handleNavLinkClick("Constructor Standings");
                    isOpen && setIsOpen(false);
                    trackButtonClick("Constructor Standings");
                }}
            >
                Constructor Standings
            </NavLink>
            <NavLink
                to="/driver-standings"
                className="block uppercase tracking-xs px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                    handleNavLinkClick("Driver Standing");
                    isOpen && setIsOpen(false);
                    trackButtonClick("Driver Standings");
                }}
            >
                Driver Standings
            </NavLink>
        </>
    );

    return (
        <>
            <header
                className={classNames("global-header max-md:transition-all", {
                    "!top-[-58px]": !headerOpen && collapsible,
                })}
                ref={headerRef}
            >
                <div className="global-header__main-nav shadow-lg bg-neutral-900/60 backdrop-blur-md">
                    <div className="global-header__main-nav__left flex items-center gap-32">
                        <a href="/">
                            <Logo height={48} />
                        </a>
                    </div>

                    {/* Mobile */}
                    <button className="md:hidden p-8" onClick={toggleOpen}>
                        <FontAwesomeIcon icon="bars" className="fa-2x" />
                    </button>

                    {collapsible && (
                        <button
                            className="absolute top-full right-20 bg-glow-large py-2 px-10 rounded-b-sm md:hidden"
                            onClick={() => setHeaderOpen(!headerOpen)}
                        >
                            <FontAwesomeIcon
                                icon="chevron-down"
                                className={classNames("fa-1x transition-all", {
                                    "transform rotate-180": headerOpen,
                                })}
                            />
                        </button>
                    )}

                    {/* Desktop */}
                    <div className="flex items-center gap-16 max-md:hidden">
                        <div className="relative group w-max uppercase text-sm ">
                            <button className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase tracking-xs">
                                Results
                                <FontAwesomeIcon
                                    icon="chevron-down"
                                    className="global-header__main-nav__button__icon opacity-0 group-hover:opacity-100"
                                />
                            </button>
                            <div className="absolute right-1 -mt-2 pt-12 w-max hidden group-hover:block">
                                <div className="flex flex-row gap-32 py-16 px-32 rounded-lg bg-glow bg-neutral-800 shadow-lg">
                                    {/* {resultsContent} */}
                                    <div className="flex flex-col gap-4 ">
                                        <F1Links />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <F1ALinks />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <F2Links />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative group w-max text-sm ">
                            <button className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase tracking-xs">
                                Comparisons
                                <FontAwesomeIcon
                                    icon="chevron-down"
                                    className="global-header__main-nav__button__icon opacity-0 group-hover:opacity-100"
                                />
                            </button>
                            <div className="absolute right-1 -mt-2 pt-12 w-max hidden group-hover:block">
                                <div className="flex flex-col gap-8 p-16 rounded-lg bg-glow bg-neutral-800 shadow-lg">
                                    <NavLink
                                        to="/teammates-comparison"
                                        className="w-[300px] bg-glow-dark hover:bg-neutral-900 border-2 border-transparent hover:border-plum-500 py-12 px-16 text-neutral-300 hover:text-white rounded-md"
                                        onClick={() => {
                                            isOpen && setIsOpen(false);
                                            trackButtonClick("Driver Comparison");
                                        }}
                                    >
                                        <p className="uppercase tracking-xs gradient-text-light">
                                            Teammate Comparisons
                                        </p>
                                        <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
                                        <p>
                                            Compare teammates directly, evaluating their performances in the same car during specific seasons.
                                        </p>
                                    </NavLink>
                                    <NavLink
                                        to="/driver-comparison"
                                        className="w-[300px] bg-glow-dark hover:bg-neutral-900 border-2 border-transparent hover:border-plum-500 py-12 px-16 text-neutral-300 hover:text-white rounded-md"
                                        onClick={() => {
                                            isOpen && setIsOpen(false);
                                            trackButtonClick("Driver Comparison");
                                        }}
                                    >
                                        <p className="uppercase tracking-xs gradient-text-light">
                                            Driver Comparisons
                                        </p>
                                        <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
                                        <p>
                                            Any driver from any team throughout F1's illustrious history. This feature empowers you to examine a vast array of performance metrics, such as the number of race wins, pole positions, and qualifying statistics.
                                        </p>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div className="relative w-max" ref={raceViewerRef}>
                            <button
                                className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase tracking-xs text-sm "
                                onClick={() =>
                                    setRaceViewerDropdownOpen(
                                        !raceViewerDropdownOpen
                                    )
                                }
                            >
                                Race Viewer
                                <FontAwesomeIcon
                                    icon="chevron-down"
                                    className={classNames(
                                        "global-header__main-nav__button__icon opacity-0",
                                        {
                                            "opacity-100":
                                                raceViewerDropdownOpen,
                                        }
                                    )}
                                />
                            </button>
                            <div
                                className={classNames(
                                    "absolute right-1 -mt-2 pt-12 w-max min-w-[20rem]",
                                    raceViewerDropdownOpen ? "block" : "hidden"
                                )}
                            >
                                <div className="flex flex-col p-16 rounded-md bg-glow bg-neutral-800 shadow-lg">
                                    {raceSelectorContent}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider-glow-dark" />
            </header>

            {/* Mobile */}
            <Modal isOpen={isOpen} onClose={toggleOpen}>
                <div className="fixed top-[0] left-[0] w-full h-full bg-glow bg-neutral-900/95 backdrop-blur-sm md:hidden z-[1001]">
                    <div className="pt-64 px-32">
                        <div className="flex flex-col">
                            <F1Links accordion />
                        </div>
                        <div className="flex flex-col">
                            <F1ALinks accordion />
                        </div>
                        <div className="flex flex-col">
                            <F2Links accordion />
                        </div>
                        
                        {/* <p className="font-display mt-16 border-b border-neutral-700">
                            Race Viewer
                        </p>
                        <div className="divider-glow-dark" />
                        <div className="flex flex-col gap-16 mt-16">
                            {raceSelectorContent}
                        </div> */}
                    </div>
                </div>
            </Modal>
        </>
    );
};

Header.propTypes = {
    setResultPage: PropTypes.func.isRequired,
    setResultPagePath: PropTypes.func.isRequired,
};
