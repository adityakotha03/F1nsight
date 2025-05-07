import React from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { FaLinkedin, FaGlobe, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "./f1nsight-outlined.svg";
import { Button } from "./Button";
import { F1ALinks, F1Links, F2Links } from "./Links";

export const Footer2025 = ({ className }) => {
    const location = useLocation().pathname;
    const hideFooter = location.startsWith("/race/");
    const currentYear = new Date().getFullYear(); // Get the current year dynamically

    return (
        <footer
            className={classNames(
                "bg-neutral-900 text-white pb-10 px-6",
                className,
                {
                    hidden: hideFooter,
                }
            )}
        >
            <div className="divider-glow-dark" />
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
                <div className="flex flex-col md:flex-row md:items-start gap-16 uppercase">
                    <div className="flex flex-col gap-4">
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

            {/* Footer Bottom: Year and Copyright */}
            <div className="text-center text-neutral-400 mt-6 bg-gradient-to-b from-neutral-950/30 to-neutral-950/10 px-16 pb-16 text-xs">
                <div className="divider-glow-dark mb-6" />
                <p className="mb-8">This website is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FORMULA 1 ACADEMY, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V.</p>
                <p>&copy; {currentYear} F1NSIGHT</p>
            </div>
        </footer>
    );
};
