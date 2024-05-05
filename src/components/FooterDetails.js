import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import classNames from 'classnames';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa'; // Importing icons from React Icons
import { ConstructorDriver } from './ConstructorDriver';

export const FooterDetails = ({ className }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const leftToRightVariant = {
        hidden: { x: -500, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 3, ease: "easeInOut" }
        }
    };

    const rightToLeftVariant = {
        hidden: { x: 500, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 3, ease: "easeInOut" }
        }
    };

    return (
        <motion.div
            className={classNames("footer-container flex items-center  gap-32 max-md:flex-col  md:justify-center bg-glow px-16 p-32 bg-neutral-950 mt-64", className)}
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <h6 className="heading-6">Created by</h6>
            <ConstructorDriver 
                year={2024}
                image="antoniF1"
                firstName="Antoni"
                lastName="Commodore"
                car="ferrari"
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
            <h6 className="heading-6">©2024 F1nsight</h6>
        </motion.div>
    );
};