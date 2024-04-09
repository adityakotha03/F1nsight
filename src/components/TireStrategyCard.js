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
  const borderWidth = '2px'; 

  return (
    <div className="mb-4 bg-black p-4 rounded-lg">
      <div className="flex items-center justify-between text-white">
        <span className="font-bold">{driver}</span>
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
                className="relative mr-2"
                style={{
                  width: boxWidth,
                  height: '25px', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '2px', 
                  backgroundColor: 'transparent', 
                  borderColor: tireClass, 
                  borderWidth: borderWidth,
                  borderStyle: 'solid',
                  boxShadow: glowEffect,
                }}
              >
                <span
                  className="font-bold"
                  style={{
                    color: tireClass, 
                    width: '100%', 
                    textAlign: 'center', 
                  }}
                >
                  {widthValue}
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
