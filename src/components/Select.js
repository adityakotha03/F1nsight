import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Select = (props) => {
    const {
        className,
        id,
        label,
        value,
        unstyled,
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
                'select--unstyled': unstyled,
            })}
        >
            <select
                {...rest}
                className={classNames('select__input', {
                    'bg-neutral-800/10 bg-glow': !unstyled,
                    'bg-transparent border-0': unstyled,
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

// use for the react select component
export const customSelectStyles = {
    option: (provided) => ({
        ...provided,
        color: 'black'
    }),
    control: (baseStyles, state) => ({
        ...baseStyles,
        borderColor: state.isFocused ? '#e5e5e5' : '#737373',
        background: '#1f1f1f',
        boxShadow: 'inset 0 0 2.4rem 0 rgba(255, 255, 255, .25), 0 0 2.4rem 0 rgba(0, 0, 0, .55)',
        color: '#f1f1f1',
        borderRadius: '1.2rem',
        padding: '.8rem',
    }),
    input: (styles, state) => ({
        ...styles,
        color: '#f1f1f1',
    }),
    placeholder: (styles) => ({ 
        ...styles, 
        color: '#cccccc',
    }),
    singleValue: (styles) => ({ 
        ...styles, 
        color: '#f1f1f1',
    }),
};