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