import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const tireTypeClasses = {
  soft: '#ffffff', 
  medium: '#ffd600', 
  hard: '#c00000',
  intermediate: '#39b54a', 
  wet: '#00aeef' 
};

export const TireStrategyCard = ({ driver, tires }) => {
  const baseWidthPerLap = 20; 

  return (
    <div className="flex items-center justify-between text-white mb-8">
      <span className="font-bold w-48">{driver}</span>
      <div className="flex-1 mx-4 flex">
        {tires.map((tire, index) => {
          const previousLapEnd = index > 0 ? tires[index - 1].lap_end : 0;
          const widthValue = index === 0 ? tire.lap_end : tire.lap_end - previousLapEnd;
          const boxWidth = `${widthValue * baseWidthPerLap}px`;
          const tireClass = tireTypeClasses[tire.compound.toLowerCase()];
          const glowEffect = `inset 0 0 10px ${tireClass}`;
          
          return (
            <div
              key={index}
              className="flex items-center gap-2 justify-center mr-2 h-24 border-2 border-solid"
              style={{
                width: boxWidth,
                borderColor: tireClass,
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: tireClass,
                  width: '100%', 
                  textAlign: 'center', 
                  boxShadow: glowEffect
                }}
              >
                {widthValue}
              </span>
            </div>
          );
        })}
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
