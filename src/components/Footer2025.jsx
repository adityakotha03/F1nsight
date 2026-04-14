import React from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { FaLinkedin, FaGlobe, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { F1TelemetryLogo as Logo } from "./F1TelemetryLogo";
import { Button } from "./Button";
import { F1ALinks, F1Links, F2Links, LegalLinks } from "./Links";
import { getCurrentYear } from "../utils/currentYear";

const currentYear = getCurrentYear();

export const Footer2025 = ({ className }) => {
  const location = useLocation().pathname;
  const hideFooter = location.startsWith("/race/");

  return (
    <footer
      className={classNames(
        "bg-neutral-900 text-white pb-10 w-full",
        className,
        {
          hidden: hideFooter,
        },
      )}
    >
      <div className="divider-glow-dark" />
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center py-64 text-base max-md:text-center px-24 font-lato">
        {/* Left side: Logo, tagline, and social links */}
        <div className="flex flex-col items-center md:items-start gap-16 mb-24 md:mb-0">
          <a href="/">
            <Logo height={48} />
          </a>
          <div>
            <p className="text-xl uppercase tracking-1xs leading-none gradient-text-light">
              Your Ultimate Destination
            </p>
            <p className="text-xl uppercase tracking-1xs leading-none gradient-text-light">
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
        <div className="flex flex-col md:flex-row md:items-start gap-24 uppercase">
          <div className="flex flex-col gap-4">
            <F1Links />
          </div>
          <div className="flex flex-col gap-4">
            <F2Links />
          </div>
          <div className="flex flex-col gap-4">
            <F1ALinks />
          </div>
          <div className="flex flex-col gap-4">
            <LegalLinks />
          </div>
        </div>
      </div>

      {/* Footer Bottom: Year and Copyright */}
      <div className="text-center text-neutral-500 mt-6 bg-gradient-to-b from-neutral-950/40 to-neutral-950/10 px-24 pb-24 text-[11px] uppercase tracking-widest leading-relaxed">
        <div className="divider-glow-dark mb-16 opacity-30" />
        <p className="max-w-[900px] mx-auto mb-8 font-light">
          This website is not associated in any way with the Formula 1
          companies. F1, FORMULA ONE, FORMULA 1, F2, FORMULA 2, FIA FORMULA 2
          CHAMPIONSHIP, F1 ACADEMY, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND
          PRIX and related marks are trade marks of Formula One Licensing B.V.
        </p>
        <p className="text-neutral-400 font-medium tracking-normal lowercase first-letter:uppercase">
          &copy; {currentYear} F1-Telemetry
        </p>
      </div>
    </footer>
  );
};
