import React from 'react';

export const Header = () => {
    return (
        <header className="mx-auto flex items-center justify-between py-4 px-16 shadow-lg bg-glow ">
            <h4 className="heading-4">f1nsight</h4>
            <input type="text" placeholder="Input 1" />
            <input type="text" placeholder="Input 2" />
            <input type="text" placeholder="Input 3" />
        </header>
    );
};