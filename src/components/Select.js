import React, { useMemo } from 'react';
import classNames from 'classnames';

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
                className="select__input bg-glow bg-transparent"
                id={inputId}
                value={value}
            />
            <label htmlFor={inputId} className="select__label tracking-xs uppercase">
                {label}
            </label>
        </div>
    );
};
