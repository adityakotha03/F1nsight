import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import classNames from 'classnames';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa'; // Importing icons from React Icons

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
            className={classNames("footer-container bg-glow p-4 bg-neutral-950 mt-64", className)}
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <div className="flex items-center">
                <motion.img
                    src="/images/2024/cars/ferrari.png"
                    alt="Animated car - Ferrari"
                    className="animated-car-image"
                    variants={rightToLeftVariant}
                    style={{
                        width: 'auto',
                        height: '50px',
                    }}
                />
                <motion.div
                    className="footer-text"
                    variants={rightToLeftVariant}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '20px',
                    }}
                >
                    Antoni Commodore
                    <a href="https://www.linkedin.com/in/antonicommodore/" className="icon-link" style={{ marginLeft: '10px' }}>
                        <FaLinkedin size={24} />
                    </a>
                    <a href="https://ant-dot-comm.github.io/ant-folio/" className="icon-link" style={{ marginLeft: '10px' }}>
                        <FaGlobe size={24} />
                    </a>
                    <a href="https://github.com/ant-dot-comm" className="icon-link" style={{ marginLeft: '10px' }}>
                        <FaGithub size={24} />
                    </a>
                </motion.div>
            </div>

            <div className="flex items-center">
                <motion.img
                    src="/images/2024/cars/mercedes.png"
                    alt="Animated car - Mercedes"
                    className="animated-car-image"
                    variants={leftToRightVariant}
                    style={{
                        width: 'auto',
                        height: '50px',
                    }}
                />
                <motion.div
                    className="footer-text"
                    variants={leftToRightVariant}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '20px',
                    }}
                >
                    Aditya Kotha
                    <a href="https://www.linkedin.com/in/aditya-kotha-59a010241/" className="icon-link" style={{ marginLeft: '10px' }}>
                        <FaLinkedin size={24} />
                    </a>
                    <a href="https://github.com/adityakotha03" className="icon-link" style={{ marginLeft: '10px' }}>
                        <FaGithub size={24} />
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
};