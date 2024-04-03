import React from 'react';

export const Header = (props) => {
    const { children} = props;
    return (
        <header className="mx-auto flex items-center justify-between py-4 px-16 shadow-lg bg-glow ">
            <h4 className="heading-4">F1nsight</h4>
            <div className="flex space-x-16">
                {children}
            </div>
        </header>
    );
};