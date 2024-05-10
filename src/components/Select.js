import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Select = (props) => {
    const {
        className,
        id,
        label,
        value,
        ...rest
    } = props;

    const inputId = `select-input-${id}`;

    return (
        <div
            className={classNames(className, "select", {
                'select--has-value': value !== "",
            })}
        >
            <select
                {...rest}
                className="select__input bg-glow bg-neutral-800/10"
                id={inputId}
                value={value}
            />
            <label htmlFor={inputId} className="select__label tracking-xs uppercase">
                {label}
            </label>
            <FontAwesomeIcon icon="caret-down" className="select__icon text-neutral-500 fa-lg" />
        </div>
    );
};
