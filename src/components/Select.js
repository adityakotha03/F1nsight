import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Select = (props) => {
    const {
        className,
        id,
        label,
        value,
        unstyled,
        ...rest
    } = props;

    const inputId = `select-input-${id}`;

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
                })}
                id={inputId}
                value={value}
            />
            <label htmlFor={inputId} className="select__label tracking-xs uppercase">
                {label}
            </label>
            <FontAwesomeIcon icon="caret-down" className="select__icon text-neutral-400 fa-lg" />
        </div>
    );
};