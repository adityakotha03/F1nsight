import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

import './ConstructorCar.scss';

export const ConstructorCarF1a = (props) => {
    const { className, points, image, name, year, drivers, index} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const driverImage = (driver) => {
        return (
            <div className="-mt-40 z-[1] relative">
                <img 
                    alt="" 
                    className=""
                    src={`${process.env.PUBLIC_URL + "/images/" + year + "/F1A/" + driver + ".png"}`}
                    width={90} 
                    style={{
                        opacity: isInView ? 1 : 0,
                        transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .3s"
                    }}
                />
                <img 
                    alt="" 
                    className="z-10 absolute drop-shadow-[0_0_14px_rgba(0,0,0,0.75)]"
                    src={`${process.env.PUBLIC_URL + "/images/" + year + "/F1A/carSideView2/" + driver + "-side2.png"}`}
                    width={90} 
                    style={{
                        transform: isInView ? "none" : "translateX(-300px)",
                        opacity: isInView ? 1 : 0,
                        transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) .2s",
                        bottom: "-.8rem",
                        right: "-3.2rem"
                    }}
                />
                <div className='absolute bottom-[-2.8rem] left-[4rem] gradient-text-light'>{driver}</div>
            </div>
        )
    };

    return (
        <div 
            className={classNames(
                className, 
                'constructor-card mt-32'
            )}
            ref={ref}
        >
            <div className="flex flex-col justify-between pb-40">
                <div className="flex flex-row items-end justify-center gap-4 mb-48 mt-32 w-3/4 m-auto leading-none">
                    <div className="font-display text-16 gradient-text-dark">{index + 1}</div> 
                    <p className="uppercase text-24 tracking-sm gradient-text-light font-light mr-12">{name}</p>
                    <span className="font-display text-24 gradient-text-light">{points}</span>
                </div>

                <div className="flex justify-between items-end relative w-3/4 ml-24">
                    {driverImage(drivers[0])}
                    {driverImage(drivers[1])}
                    {driverImage(drivers[2])}
                </div>
            </div>
            <div className="constructor-stand bg-glow h-16 m-auto -mt-32" />
            <div className="divider-glow-dark w-full" />
        </div>
    );
};
