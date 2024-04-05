import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const tireTypeClasses = {
  soft: '#c00000', 
  medium: '#ffd600', 
  hard: '#ffffff',
  intermediate: '#4caf50', 
  wet: '#1b5e20' 
};

export const TireStrategyCard = ({ driver, tires }) => {
  const baseWidthPerLap = 20; 
  const borderWidth = '2px'; 

  return (
    <div>
      <div className="flex items-center">
        <span className="font-display w-40">{driver}</span>
        <div className="flex-1 flex mx-4">
          {tires.map((tire, index) => {
            const previousLapEnd = index > 0 ? tires[index - 1].lap_end : 0;
            const widthValue = index === 0 ? tire.lap_end : tire.lap_end - previousLapEnd;
            const boxWidth = `${widthValue * baseWidthPerLap}px`;
            const tireClass = tireTypeClasses[tire.compound.toLowerCase()];
            
            return (
              <div
                key={index}
                className={classNames(
                  "flex grow h-24 items-center justify-center mr-4 bg-transparent", {
                  "bg-glow-red border-2 border-red-800": tire.compound === "SOFT",
                  "bg-glow-yellow border-2 border-yellow-500": tire.compound === "MEDIUM",
                  "bg-glow border-2 border-gray-400": tire.compound === "HARD",
                  }
                )}
              >
                <span
                  className="font-display"
                  style={{
                    color: tireClass, 
                    width: '100%', 
                    textAlign: 'center', 
                  }}
                >
                  {widthValue}{tire.compound}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

TireStrategyCard.propTypes = {
  driver: PropTypes.shape({
    acronym: PropTypes.string.isRequired,
  }),
  tires: PropTypes.arrayOf(
    PropTypes.shape({
      lap_start: PropTypes.number.isRequired,
      lap_end: PropTypes.number.isRequired,
      compound: PropTypes.string.isRequired,
    })
  ),
};
