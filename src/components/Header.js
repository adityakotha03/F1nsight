import React from 'react';

export const Header = (props) => {
    const { children} = props;
    return (
        <header className="flex flex-col items-start sm:items-center sm:flex-row sm:justify-between gap-8 py-8 px-16 shadow-lg bg-glow ">
            <h4 className="heading-2">F1nsight</h4>
            <div className="flex flex-col sm:flex-row max-sm:w-full gap-8">
                {children}
            </div>
        </header>
    );
};