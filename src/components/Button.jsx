import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Button = ({ as: Component = 'button', className, to, href, onClick, children, buttonStyle, size='md', active, ...rest }) => {
    const sizeStyle = classNames({
        'px-16 py-4': size === 'sm',
        'px-24 py-8': size === 'md',
        'px-24 py-12': size === 'lg',
    });
    const buttonBaseStyle = classNames(className, sizeStyle, "relative flex items-center justify-center overflow-hidden font-bold rounded-[.8rem] shadow-2xl")
    const solidButtonStyle = classNames(buttonBaseStyle, "bg-plum-500 hover:bg-gradient-to-br hover:from-plum-500 hover:to-plum-300 ");
    const hollowButtonStyle = classNames(buttonBaseStyle, "bg-glow hover:bg-gradient-to-br hover:from-neutral-800 hover:from-neutral-700 ");
    const activeButtonStyle = classNames(buttonBaseStyle, active ? buttonStyle === 'hollow' ? hollowButtonStyle : solidButtonStyle : 'bg-neutral-800 shadow-md');

    const finalStyle =  active !== undefined ? activeButtonStyle : buttonStyle === 'hollow' ? hollowButtonStyle : solidButtonStyle;

    if (to) {
        return (
            <NavLink to={to} className={finalStyle} {...rest}>
                {children}
            </NavLink>
        );
    } else if (href) {
        return (
            <a href={href} className={finalStyle} {...rest}>
                {children}
            </a>
        );
    } else {
        return (
            <Component onClick={onClick} className={finalStyle} {...rest}>
                {children}
            </Component>
        );
    }
};

