import React from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { FaLinkedin, FaGlobe, FaInstagram } from 'react-icons/fa';

import { ConstructorDriver } from './ConstructorDriver';

export const Footer2025 = ({ className }) => {
    const location = useLocation().pathname;
    const hideFooter = location.startsWith('/race/');

    return (
        <div
            className={classNames("footer flex justify-center flex-col bg-glow bg-glow-large px-16 p-32 mt-64", className, {
                'hidden': hideFooter})}
        > 
            <div className="flex flex-col items-center gap-2 md:text-right mt-32">
                <p className="tracking-sm text-neutral-400 text-sm">Enjoy our work? Follow us here:</p>
                <div className="flex items-center gap-32 mt-16 mb-16">
                    <a href="https://www.instagram.com/f1nsight1/" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2">
                        <FaInstagram size={24} />
                    </a>
                </div>
                <p className="tracking-sm text-neutral-400 text-sm">©2024 F1nsight</p>
            </div>
        </div>
    );
};
