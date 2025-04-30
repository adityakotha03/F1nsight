import Accordion from "../components/Accordion.js";
import React from "react";
import { Link } from "react-router-dom";

export const F1Links = ({accordion = false}) => {
    const currentYear = new Date().getFullYear(); // Get the current year dynamically
    const links = (
        <>
            <Link to="/race-results" className="hover:text-gray-300">
                {currentYear} Race Results
            </Link>
            <Link
                to="/constructor-standings"
                className="hover:text-gray-300"
            >
                Contructor Standings
            </Link>
            <Link
                to="/driver-standings"
                className="hover:text-gray-300"
            >
                Driver Standings
            </Link>
            <Link
                to="/driver-comparison"
                className="hover:text-gray-300"
            >
                Driver Comparisons
            </Link>
            <Link
                to="/teammates-comparison"
                className="hover:text-gray-300"
            >
                Teammate Comparisons
            </Link>
            <Link
                to="/ar-viewer"
                className="hover:text-gray-300"
            >
                Team Hstory
            </Link>
        </>
    )
    return accordion ? (
        <Accordion title="Formula 1" contentClasses="flex flex-col gap-8 items-start" defaultOpen={true}>
            {links}
        </Accordion>
    ) : (
        <>
            <div>
                <p className="uppercase tracking-xs gradient-text-light">
                    Formula 1
                </p>
                <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
            </div>
            {links}
        </>
    )
};

export const F1ALinks = ({accordion = false}) => {
    const currentYear = new Date().getFullYear(); // Get the current year dynamically
    const links = (
        <>
            <Link
                to="/f1a/race-results"
                className="hover:text-gray-300"
            >
                {currentYear} Race Results
            </Link>
            <Link
                to="/f1a/constructor-standings"
                className="hover:text-gray-300"
            >
                Contructor Standings
            </Link>
            <Link
                to="/f1a/driver-standings"
                className="hover:text-gray-300"
            >
                Driver Standings
            </Link>
        </>
    )
    return accordion ? (
        <Accordion title="Formula 1 Academy" contentClasses="flex flex-col gap-8 items-start">
            {links}
        </Accordion>
    ) : (
        <>
            <div>
                <p className="uppercase tracking-xs gradient-text-light">
                    Formula 1 Academy
                </p>
                <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
            </div>
            {links}
        </>
    )
};

export const F2Links = ({accordion = false}) => {
    const currentYear = new Date().getFullYear(); // Get the current year dynamically
    const links = (
        <>
            <Link
                to="/f2/race-results"
                className="hover:text-gray-300"
            >
                {currentYear} Race Results
            </Link>
            <Link
                to="/f2/constructor-standings"
                className="hover:text-gray-300"
            >
                Contructor Standings
            </Link>
            <Link
                to="/f2/driver-standings"
                className="hover:text-gray-300"
            >
                Driver Standings
            </Link>
        </>
    )
    return accordion ? (
        <Accordion title="Formula 2" contentClasses="flex flex-col gap-8 items-start">
            {links}
        </Accordion>
    ) : (
        <>
            <div>
                <p className="uppercase tracking-xs gradient-text-light">
                    Formula 2
                </p>
                <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
            </div>
            {links}
        </>
    )
};
