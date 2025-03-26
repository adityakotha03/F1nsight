import React from "react";
import { Link } from "react-router-dom";

export const F1Links = () => {
    const currentYear = new Date().getFullYear(); // Get the current year dynamically
    return (
        <>
            <div>
                <p className="uppercase tracking-xs gradient-text-light">
                    Formula 1
                </p>
                <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
            </div>
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
                Team Comparisons
            </Link>
        </>
    );
};

export const F1ALinks = () => {
    const currentYear = new Date().getFullYear(); // Get the current year dynamically
    return (
        <>
            <div>
                <p className="uppercase tracking-xs gradient-text-light">
                    Formula 1 Academy
                </p>
                <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
            </div>
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
    );
};
