import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { ConstructorDriver } from './ConstructorDriver';

export const FooterDetails = ({ className }) => {
    return (
        <motion.div
            className={classNames("footer-details flex items-center md:items-end max-md:flex-col md:justify-between bg-glow bg-glow--large px-16 p-32 mt-64", className)}
        >   
            <div className="flex max-md:flex-col items-center md:items-end">
                <h6 className="tracking-sm text-neutral-500 text-sm md:mb-16">Creators</h6>
                <ConstructorDriver 
                    className=""
                    year={2024}
                    image="antoniF1"
                    firstName="Antoni"
                    lastName="Commodore"
                    car="ferrari"
                    showDivider
                    points={
                        <div className="flex item-center">
                        <a href="https://www.linkedin.com/in/antonicommodore/" className="icon-link" style={{ marginLeft: '10px' }}>
                            <FaLinkedin size={24} />
                        </a>
                        <a href="https://ant-dot-comm.github.io/ant-folio/" className="icon-link" style={{ marginLeft: '10px' }}>
                            <FaGlobe size={24} />
                        </a>
                        <a href="https://github.com/ant-dot-comm" className="icon-link" style={{ marginLeft: '10px' }}>
                            <FaGithub size={24} />
                        </a>
                        </div>
                    }
                />
                <ConstructorDriver 
                    year={2024}
                    image="adityaF1"
                    firstName="Aditya"
                    lastName="Kotha"
                    car="mercedes"
                    className="max-md:mt-16"
                    showDivider
                    points={
                        <div className="flex item-center">
                        <a href="https://www.linkedin.com/in/aditya-kotha-59a010241/" className="icon-link" style={{ marginLeft: '10px' }}>
                            <FaLinkedin size={24} />
                        </a>
                        <a href="https://github.com/adityakotha03" className="icon-link" style={{ marginLeft: '10px' }}>
                            <FaGithub size={24} />
                        </a>
                        </div>
                    }
                />
            </div>
            
            <h6 className="tracking-sm text-neutral-500 text-sm max-md:mt-48 md:mb-16">©2024 F1nsight</h6>
        </motion.div>
    );
};