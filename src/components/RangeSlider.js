import React from 'react';

import './RangeSlider.scss';

const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className={`custom-slider w-full h-10 bg-neutral-900 rounded-lg appearance-none cursor-pointer focus:outline-none shadow-md ${className}`}
      {...props}
    />
  );
};

export default RangeSlider;