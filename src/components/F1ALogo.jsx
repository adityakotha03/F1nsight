import React from "react";
import PropTypes from "prop-types";

export const F1ALogo = ({ height = 48, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logos/f1a.png"
        alt="F1A Logo"
        style={{
          height: `${height}px`,
        }}
        className="drop-shadow-md object-contain"
      />
      <span className="font-display text-[1.8rem] sm:text-[2.2rem] font-bold uppercase tracking-widest gradient-text-white italic pr-6 group-hover:gradient-text-light transition-all text-nowrap">
        F1A RESULTS
      </span>
    </div>
  );
};

F1ALogo.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
};
