import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

export const ConstructorCar = (props) => {
    const { className, points, image, name, year, drivers} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div 
            className={classNames(
                className, 
                'constructor-card mt-64'
            )}
            ref={ref}
        >
            <div className="flex flex-col items-center">
                <p className="heading-4 -mb-4 constructor-title gradient-text-dark">{name}</p>
                <span className="heading-1">{points}</span>
                <div className="flex items-end">
                    <img 
                        alt="" 
                        className="-mt-40 -mr-40"
                        height={85} 
                        src={`/images/${year}/drivers/${drivers[0]}.png`} 
                        width={120} 
                        style={{
                            opacity: isInView ? 1 : 0,
                            transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .3s"
                        }}
                    />
                    <img 
                        alt="" 
                        className="-mt-16 -mb-32 z-10"
                        height={85} 
                        src={`/images/${year}/cars/${image}.png`} 
                        width={288} 
                        style={{
                            transform: isInView ? "none" : "translateX(-300px)",
                            opacity: isInView ? 1 : 0,
                            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) .2s"
                        }}
                    />
                    <img 
                        alt="" 
                        className="-mt-40 -ml-40 -mr-40"
                        height={85} 
                        src={`/images/${year}/drivers/${drivers[1]}.png`} 
                        width={120} 
                        style={{
                            opacity: isInView ? 1 : 0,
                            transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .3s"
                        }}
                    />
                    {drivers[2] && (
                        <img 
                            alt="" 
                            className="-mt-40"
                            height={85} 
                            src={`/images/${year}/drivers/${drivers[2]}.png`} 
                            width={120} 
                            style={{
                                opacity: isInView ? 1 : 0,
                                transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .4s"
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="divider-glow-dark w-full" />
        </div>
    );
};

ConstructorCar.propTypes = {
    className: PropTypes.string,
    drivers: PropTypes.array,
    year: PropTypes.string,
    points: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
};