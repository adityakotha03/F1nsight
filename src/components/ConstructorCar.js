import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

import './ConstructorCar.scss';
import { Button } from './Button';

export const ConstructorCar = (props) => {
    const { championshipLevel, color, className, points, image, name, year, drivers, index} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const driverUrl = (index) => championshipLevel === 'f2' ? 
    `${process.env.PUBLIC_URL + "/images/" + year + "/F2/" + drivers[index] + ".png"}` 
    : `${process.env.PUBLIC_URL + "/images/" + year + "/drivers/" + drivers[index] + ".png"}`

    const carUrl = championshipLevel === 'f2' ? 
    `${process.env.PUBLIC_URL + "/images/" + year + "/F2/carSideView/" + image + ".png"}`
    : `${process.env.PUBLIC_URL + "/images/" + year + "/cars/" + image + ".png"}`

    const groupHoverClasses = "group-hover:scale-[1.05] duration-150 transition-transform ease-in-out"

    return (
        <div 
            className={classNames(
                className, 
                'constructor-card mt-32 group duration-150 transition-transform ease-in-out hover:scale-[.98] hover:cursor-pointer'
            )}
            ref={ref}
        >
            <div className="flex flex-col items-center pb-40">
                <div div className="flex items-end mb-4">
                    <div className="h-1 w-32 border-b-[1px] border-solid border-neutral-500" />
                    <div className="font-display text-24 leading-none -mb-4 mx-8 text-neutral-400">
                        {index + 1}
                    </div>
                    <div className="h-1 w-32 border-b-[1px] border-solid border-neutral-500" />
                </div>
                <p className="uppercase tracking-sm text-xl">{name.replace('F1 Team', '')}</p>
                <div className="h-1 w-[9.6rem] border-b-[1px] border-solid border-neutral-500 mb-4 mt-4" />
                <span className="heading-1 gradient-text-light ">{points}</span>
                <div className={classNames(groupHoverClasses, "flex items-end relative -mt-24 z-10")}>
                    {drivers[3] && (
                        <img 
                            alt="" 
                            className="absolute left-[-4rem] z-[1] rounded-t-lg"
                            src={driverUrl(3)}
                            width={90} 
                            style={{
                                opacity: isInView ? 1 : 0,
                                transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .4s"
                            }}
                        />
                    )}
                    <img 
                        alt="" 
                        className="-mt-40 -mr-80 sm:-mr-60 z-[1] rounded-t-lg"
                        src={driverUrl(0)}
                        width={100} 
                        style={{
                            opacity: isInView ? 1 : 0,
                            transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .3s"
                        }}
                    />

                    <img 
                        alt="" 
                        className="-mt-16 -mb-[2.2rem] z-10"
                        src={carUrl}
                        width={264} 
                        style={{
                            transform: isInView ? "none" : championshipLevel === 'f2' ? "translateX(300px)" : "translateX(-300px)",
                            opacity: isInView ? 1 : 0,
                            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) .2s"
                        }}
                    />

                    <img 
                        alt="" 
                        className="-mt-40 -ml-80 sm:-ml-60 z-[1] rounded-t-lg"
                        src={driverUrl(1)}
                        width={100} 
                        style={{
                            opacity: isInView ? 1 : 0,
                            transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .3s"
                        }}
                    />
                    {drivers[2] && (
                        <img 
                            alt="" 
                            className="absolute right-[-4rem] z-[1] rounded-t-lg"
                            src={driverUrl(2)}
                            width={90} 
                            style={{
                                opacity: isInView ? 1 : 0,
                                transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .4s"
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="constructor-stand bg-glow h-16 m-auto -mt-32 border-b-[1px]" style={{borderColor: color}} />
            <div className="divider-glow-dark w-full" />
            {championshipLevel !== 'f2' && (
                <Button size='sm' disabled className="opacity-0 group-hover:opacity-100 !absolute -bottom-[2.4rem] left-1/2 -translate-x-1/2">View Comparison</Button>
            )}
        </div>
    );
};

ConstructorCar.propTypes = {
    className: PropTypes.string,
    drivers: PropTypes.array,
    year: PropTypes.number,
    points: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
};