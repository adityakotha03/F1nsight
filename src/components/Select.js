import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ReactSelect, {components} from 'react-select';

export const Select = (props) => {
    const {
        className,
        id,
        label,
        value,
        fullWidth,
        ...rest
    } = props;

    const [selectValue, setSelectValue] = useState('');

    const inputId = `select-input-${id}`;

    useEffect(() => {
        setSelectValue(value)
    }, [value]);

    return (
        <div
            className={classNames(className, "select", {
                'select--has-value': value !== "",
            })}
        >
            <select
                {...rest}
                className={classNames('select__input bg-glow', {
                    'w-full': fullWidth,
                })}
                id={inputId}
                value={selectValue}
            />
            <label htmlFor={inputId} className="select__label tracking-xs uppercase">
                {label}
            </label>
        </div>
    );
};

const CustomSelectContainer = ({ children, ...props }) => {
    const { hasValue, selectProps } = props;
  
    return (
      <components.ValueContainer 
        {...props}
        className={classNames(
            "custom-select-container", 
            hasValue ? 'has-value' : '', 
        )}
    >
        <div 
            className={classNames(
                `placeholder ${hasValue ? 'has-value text-neutral-400' : ''}`,
                "uppercase tracking-xs"
            )}
        >
          {selectProps.placeholder}
        </div>
        {children}
      </components.ValueContainer>
    );
  };
  
  const customComponents = {
    ValueContainer: CustomSelectContainer,
  };
  
  const CustomSelect = (props) => {
    const customStyles = {
        option: (provided) => ({
            ...provided,
            color: 'black'
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#e5e5e5' : '#737373',
            background: '#1f1f1f',
            height: '4.8rem',
            boxShadow: 'inset 0 0 2.4rem 0 rgba(255, 255, 255, .25), 0 0 2.4rem 0 rgba(0, 0, 0, .55)',
            color: '#f1f1f1',
            borderRadius: '1rem',
            padding: '0 0 0 1.6rem',
        }),
        input: (styles, state) => ({
            ...styles,
            color: '#f1f1f1',
            display: 'inline-flex',
        }),
        placeholder: () => ({ display: "none" }),
        singleValue: (styles) => ({ 
            ...styles, 
            fontFamily: 'Bungee',
            color: '#f1f1f1',
            margin: '0',
        }),
        valueContainer: base => ({
            ...base,
            overflow: 'visible',
            padding: '0',
        }),
        indicatorSeparator: () => ({ display: "none" }),
      }
    return (
      <ReactSelect
        {...props}
        components={customComponents}
        styles={customStyles} 
      />
    );
};

export const ReactSelectComponent = (props) => {
    const { className, ...rest } = props;
    
    return (
        <CustomSelect
            {...rest}
            className={`custom-select`}
        />
    );
}