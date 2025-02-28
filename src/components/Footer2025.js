import React from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { FaLinkedin, FaGlobe, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "./f1nsight-outlined.svg";
import { Button } from "./Button";

export const Footer2025 = ({ className }) => {
    const location = useLocation().pathname;
    const hideFooter = location.startsWith("/race/");
    const currentYear = new Date().getFullYear(); // Get the current year dynamically

    return (
        <footer
            className={classNames(
                "bg-neutral-900 text-white py-10 px-6",
                className,
                {
                    hidden: hideFooter,
                }
            )}
        >
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-64 text-sm max-md:text-center">
                {/* Left side: Logo, tagline, and social links */}
                <div className="flex flex-col items-center md:items-start gap-16 mb-24 md:mb-0">
                    <a href="/">
                        <Logo height={48} />
                    </a>
                    <div>
                        <p className="uppercase tracking-xs leading-none gradient-text-light">
                            Your Ultimate Destination
                        </p>
                        <p className="uppercase tracking-xs leading-none gradient-text-light">
                            for F1 Data and Analysis
                        </p>
                    </div>
                    <Button
                        as="href"
                        className="flex flex-row items-center gap-16"
                        href="https://www.instagram.com/f1nsight1/"
                        target="_blank"
                        rel="noopener noreferrer"
                        buttonStyle="hollow"
                        size="sm"
                    >
                        <FaInstagram size={24} />
                        <p className="uppercase tracking-xs">Follow us</p>
                    </Button>
                </div>

                {/* Right side: Page path links */}
                <div className="flex flex-col md:flex-row md:items-start gap-16">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="uppercase tracking-xs gradient-text-light">
                                Formula 1
                            </p>
                            <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
                        </div>
                        <Link
                            to="/race-results"
                            className="text-white hover:text-gray-300"
                        >
                            {/* {currentYear} Race Results */}
                            2024 Race Results
                        </Link>
                        <Link
                            to="/constructor-standings"
                            className="text-white hover:text-gray-300"
                        >
                            Contructor Standings
                        </Link>
                        <Link
                            to="/driver-standings"
                            className="text-white hover:text-gray-300"
                        >
                            Driver Standings
                        </Link>
                        <Link
                            to="/driver-comparison"
                            className="text-white hover:text-gray-300"
                        >
                            Driver Comparisons
                        </Link>
                        <Link
                            to="/teammates-comparison"
                            className="text-white hover:text-gray-300"
                        >
                            Team Comparisons
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="uppercase tracking-xs gradient-text-light">
                                Formula 1 Academy
                            </p>
                            <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
                        </div>
                        <Link
                            to="/f1a/race-results"
                            className="text-white hover:text-gray-300"
                        >
                            {/* {currentYear} Race Results */}
                            2024 Race Results
                        </Link>
                        <Link
                            to="/f1a/constructor-standings"
                            className="text-white hover:text-gray-300"
                        >
                            Contructor Standings
                        </Link>
                        <Link
                            to="/f1a/driver-standings"
                            className="text-white hover:text-gray-300"
                        >
                            Driver Standings
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer Bottom: Year and Copyright */}
            <div className="text-center text-neutral-400 mt-6 bg-gradient-to-b from-neutral-950/30 to-neutral-950/10 p-16 text-sm">
                <p>&copy; {currentYear} F1NSIGHT. All rights reserved.</p>
            </div>
        </footer>
    );
};
