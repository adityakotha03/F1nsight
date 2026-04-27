import Accordion from "../components/Accordion";
import React from "react";
import { Link } from "react-router-dom";
import { getCurrentYear } from "../utils/currentYear";

const currentYear = getCurrentYear();

export const F1Links = ({ accordion = false, onClick }) => {
  const links = (
    <>
      <Link
        to="/race-results"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        {currentYear} Race Results
      </Link>
      <Link
        to="/constructor-standings"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Constructor Standings
      </Link>
      <Link
        to="/driver-standings"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Driver Standings
      </Link>
      <Link
        to="/driver-comparison"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Driver Comparisons
      </Link>
      <Link
        to="/teammates-comparison"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Teammate Comparisons
      </Link>
      <Link
        to="/ar-viewer"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Team History
      </Link>
    </>
  );
  return accordion ? (
    <Accordion
      title="Formula 1"
      contentClasses="flex flex-col gap-8 items-start"
      titleClassName="text-lg font-bold"
      defaultOpen={true}
    >
      {links}
    </Accordion>
  ) : (
    <>
      <div>
        <p className="uppercase tracking-xs gradient-text-light text-lg font-bold">
          Formula 1
        </p>
        <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
      </div>
      {links}
    </>
  );
};

export const F1ALinks = ({ accordion = false, onClick }) => {
  const links = (
    <>
      <Link
        to="/f1a/race-results"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        {currentYear} Race Results
      </Link>
      <Link
        to="/f1a/constructor-standings"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Constructor Standings
      </Link>
      <Link
        to="/f1a/driver-standings"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Driver Standings
      </Link>
    </>
  );
  return accordion ? (
    <Accordion
      title="F1 Academy"
      contentClasses="flex flex-col gap-8 items-start"
      titleClassName="text-lg font-bold"
    >
      {links}
    </Accordion>
  ) : (
    <>
      <div>
        <p className="uppercase tracking-xs gradient-text-light text-lg font-bold">
          F1 Academy
        </p>
        <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
      </div>
      {links}
    </>
  );
};

export const F2Links = ({ accordion = false, onClick }) => {
  const links = (
    <>
      <Link
        to="/f2/race-results"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        {currentYear} Race Results
      </Link>
      <Link
        to="/f2/constructor-standings"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Constructor Standings
      </Link>
      <Link
        to="/f2/driver-standings"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Driver Standings
      </Link>
    </>
  );
  return accordion ? (
    <Accordion
      title="Formula 2"
      contentClasses="flex flex-col gap-8 items-start"
      titleClassName="text-lg font-bold"
    >
      {links}
    </Accordion>
  ) : (
    <>
      <div>
        <p className="uppercase tracking-xs gradient-text-light text-lg font-bold">
          Formula 2
        </p>
        <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
      </div>
      {links}
    </>
  );
};
export const LegalLinks = ({ accordion = false, onClick }) => {
  const links = (
    <>
      <Link
        to="/privacy-policy"
        className="hover:text-gray-300 text-xl"
        onClick={onClick}
      >
        Privacy Policy
      </Link>
    </>
  );
  return accordion ? (
    <Accordion
      title="Legal"
      contentClasses="flex flex-col gap-8 items-start"
      titleClassName="text-lg font-bold"
    >
      {links}
    </Accordion>
  ) : (
    <>
      <div>
        <p className="uppercase tracking-xs gradient-text-light text-lg font-bold">
          Legal
        </p>
        <div className="divider-glow-dark mt-8 border-t border-neutral-700" />
      </div>
      {links}
    </>
  );
};
