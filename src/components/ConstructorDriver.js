import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

export const ConstructorDriver = (props) => {
    const { className, points, image, firstName, lastName, year, type} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <>
            <div 
                className={classNames(
                    className, 
                    'constructor-driver-card mt-64 flex item-start'
                )}
                ref={ref}
            >
                <img 
                    alt="" 
                    className=""
                    height={120} 
                    src={`/images/${year}/${type}/${image}.png`} 
                    width={type === 'cars' ? 288 : 120} 
                    style={{
                        transform: isInView ? "none" : "translateX(-50px)",
                        opacity: isInView ? 1 : 0,
                        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
                    }}
                />
                <div className="">
                    <p className="gradient-text-medium uppercase text-xl tracking-wide">{firstName}</p>
                    <p className="heading-2">{lastName}</p>
                    {/* carimage */}
                    <span className="heading-1">{points}</span>
                </div>
            </div>
            <div className="divider-glow-dark w-full" />
        </>
    );
};

ConstructorDriver.propTypes = {
    className: PropTypes.string,
    year: PropTypes.string,
    points: PropTypes.string,
    image: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    type: PropTypes.string,
};