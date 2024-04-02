import React, { useState } from 'react';
import classNames from 'classnames';

export const Popover = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const togglePopover = () => {
    setIsVisible(!isVisible);
  };

  const calculatePosition = (e) => {
    const rect = e.target.getBoundingClientRect();
    const top = rect.top + window.pageYOffset;
    const left = rect.left + window.pageXOffset;

    setPosition({
      top: top + rect.height,
      left: left + rect.width / 2,
    });
  };

  return (
    <div className="relative inline-block">
      <div onMouseEnter={calculatePosition} onMouseLeave={togglePopover} onClick={togglePopover}>
        {children}
      </div>
      {isVisible && (
        <div
          className={classNames(
            'absolute z-10 bg-white border border-gray-300 shadow-lg rounded p-2',
            'transform -translate-x-1/2',
            {
              'top-full -left-1/2': position.top > window.innerHeight / 2,
              'bottom-full -left-1/2': position.top <= window.innerHeight / 2,
              'left-full -top-1/2': position.left > window.innerWidth / 2,
              'right-full -top-1/2': position.left <= window.innerWidth / 2,
            }
          )}
          style={{ top: position.top, left: position.left }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
