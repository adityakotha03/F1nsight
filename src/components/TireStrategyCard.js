import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const tireTypeClasses = {
  soft: 'bg-red-600',
  medium: 'bg-yellow-400',
  hard: 'bg-white',
  // Add more tire types
};

export const TireStrategyCard = ({ driver, tires }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <span className="text-white font-bold">{driver.acronym}</span>
        <div className="flex-1 ml-4">
          {tires.map((tire, index) => (
            <span
              key={index}
              className={classNames(
                'inline-block h-6',
                tireTypeClasses[tire.compound.toLowerCase()], 
                {
                  'mr-2': index < tires.length - 1, 
                }
              )}
              style={{ width: `${tire.lap_end * 4}px` }} 
            >
              {index === 0 || tires[index - 1].lap_end !== tire.lap_start ? (
                <span className="text-xs text-white pl-1">{tire.lap_start}</span>
              ) : null}
            </span>
          ))}
        </div>
        <span className="text-white font-bold">{tires[tires.length - 1].lap_end}</span>
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