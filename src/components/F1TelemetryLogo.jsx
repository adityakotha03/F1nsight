import React from "react";
import PropTypes from "prop-types";

export const F1TelemetryLogo = ({ height = 48, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logos/header.png"
        alt="F1 Telemetry Logo"
        style={{
          height: `${height}px`,
        }}
        className="drop-shadow-md object-contain"
      />
      <span className="font-display text-[1.8rem] sm:text-[2.2rem] font-bold uppercase tracking-widest gradient-text-white italic pr-6 text-nowrap">
        F1 TELEMETRY
      </span>
    </div>
  );
};

F1TelemetryLogo.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
};
