import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import { FaGithub, FaLinkedin, FaGlobe, FaInstagram } from 'react-icons/fa';
import { ConstructorDriver } from './ConstructorDriver';

export const Footer = ({ className }) => {
    return (
        <div
            className={classNames("footer flex justify-center flex-col bg-glow bg-glow--large px-16 p-32 mt-64", className)}
        >   
            <div className="flex flex-col justify-center">   
                <p className="tracking-sm text-neutral-400 text-sm text-center md:mt-16 mb-16">Creators</p>    
                <div className="flex max-md:flex-col max-md:items-center md:justify-center">
                    <ConstructorDriver 
                        className=""
                        year={2024}
                        image="antoniF1"
                        firstName="Antoni"
                        lastName="Commodore"
                        car="f1nsight-sideview"
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
                        car="f1nsight-sideview"
                        className="max-md:mt-16"
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
                    <ConstructorDriver 
                        year={2024}
                        image="PraneethF1"
                        firstName="Mani"
                        lastName="Praneeth"
                        car="f1nsight-sideview"
                        className="max-md:mt-16"
                        points={
                            <div className="flex item-center">
                            <a href="https://www.linkedin.com/in/mani-praneeth-chilukuri-a099a21ba/" className="icon-link" style={{ marginLeft: '10px' }}>
                                <FaLinkedin size={24} />
                            </a>
                            <a href="https://github.com/praneeth7781" className="icon-link" style={{ marginLeft: '10px' }}>
                                <FaGithub size={24} />
                            </a>
                            </div>
                        }
                    />
                </div>
            </div>
            <div className="flex flex-col items-center gap-2 md:text-right mt-32">
                <p className="tracking-sm text-neutral-400 text-sm">Enjoy our work? Follow us here:</p>
                <div className="flex items-center gap-32 mt-16 mb-16">
                    <a href="https://www.instagram.com/f1nsight1/" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2">
                        <FaInstagram size={24} />
                    </a>
                    <a href="https://github.com/adityakotha03/F1nsight" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2">
                        <FaGithub size={24} />
                    </a>
                </div>
                <p className="tracking-sm text-neutral-400 text-sm">©2024 F1nsight</p>
            </div>
        </div>
    );
};
