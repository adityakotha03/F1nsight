import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Button = ({ className, to, href, onClick, children, buttonStyle, size='md', active }) => {
    const isActiveEffective = active !== undefined ? true : false;
    const sizeStyle = classNames({
        'px-16 py-8': size === 'sm',
        'px-24 py-16': size === 'md',
        'px-24 py-24': size === 'lg',
    });
    const buttonBaseStyle = classNames(className, sizeStyle, "relative flex items-center justify-center px-24 py-16 overflow-hidden font-bold rounded shadow-2xl")
    const solidButtonStyle = classNames(buttonBaseStyle, "bg-plum-500 hover:bg-gradient-to-br hover:from-plum-500 hover:to-plum-300 ");
    const hollowButtonStyle = classNames(buttonBaseStyle, "bg-glow hover:bg-gradient-to-br hover:from-neutral-800 hover:from-neutral-700 ");
    const activeButtonStyle = classNames(buttonBaseStyle, active ? buttonStyle === 'hollow' ? hollowButtonStyle : solidButtonStyle : 'bg-neutral-800 shadow-md');
    const buttonHoverStyle = (<span className={classNames("absolute inset-0 w-full h-full opacity-0 bg-gradient-to-br from-plum-500  to-plum-300 group-hover:opacity-100")} />);

    const finalStyle =  isActiveEffective ? activeButtonStyle : buttonStyle === 'hollow' ? hollowButtonStyle : solidButtonStyle;

    if (to) {
        return (
            <NavLink to={to} className={finalStyle}>
                {children}
            </NavLink>
        );
    } else if (href) {
        return (
            <a href={href} className={finalStyle}>
                {children}
            </a>
        );
    } else {
        return (
            <button onClick={onClick} className={finalStyle}>
                {children}
            </button>
        );
    }
};