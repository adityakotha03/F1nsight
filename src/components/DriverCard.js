import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover } from "flowbite-react";
import { useInView } from "framer-motion";

export const DriverCard = (props) => {
    const { className, carNumber, driver, fastestLap, grid, position, isActive, layoutSmall, status, time, year, hasHover, index} = props;

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
    return (
        <div className={classNames(
            className, 
            'driver-card flex items-center bg-glow gradient-border relative',
            { 'bg-glow--sm': layoutSmall},
            isActive ? "bg-glow--active" : hasHover ? "bg-glow--hover" : ""
        )}>
            {layoutSmall ? (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <p className="heading-4 w-72 bg-neutral-600 ">P{position}</p>
                        <span className="heading-4 pl-16">{driver.code}</span>
                    </div>
                    <p className="text-sm pr-8">{time}</p>
                </div>
            ) : (
                <div className='flex item-center w-full'>
                    <p className="heading-1 p-8 bg-neutral-700">P{position}</p>
                    <img 
                        alt="" 
                        src={`/images/${year}/drivers/${driver.code}.png`} 
                        width={80} 
                        height={80} 
                        ref={ref}
                        className="absolute left-48 inset-x-0 -bottom-1"
                        style={{
                            opacity: isInView ? 1 : 0,
                            transition: `all 1s cubic-bezier(0.17, 0.55, 0.55, 1) .${index}s`
                        }}
                    />
                    <div className="grow p-12 text-right">
                        <span className="heading-4 mb-12 pl-60">{driver.code}</span>
                        <div className="divider-glow w-full" /> 
                        <p className={classNames("text-sm -mt-8")}>{time}</p>
                    </div>
                </div>
            )}
            
            {fastestLap?.rank === "1" && (
                <Popover
                    aria-labelledby="default-popover"
                    className="bg-glow gradient-border p-4 bg-gray-950/60 backdrop-blur-sm"
                    trigger="hover"
                    placement="top"
                    // open={true}
                    arrow={false}
                    content={
                        <div className="p-4">
                            <div className="bg-neutral-500 text-center font-display">
                                {fastestLap.Time.time}
                            </div>

                            <div className="flex align-start justify-around">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm">Lap</span>
                                    <span className="font-display">{fastestLap.lap}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-sm">Tyre</span>
                                    <span className="font-display">?</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-sm">Avg Speed</span>
                                <div>
                                    <span className="font-display">{fastestLap.AverageSpeed.speed}</span>
                                    <span className="text-sm">{fastestLap.AverageSpeed.units}</span>
                                </div>
                            </div>
                            
                        </div>
                    }
                >
                    <span className="fa-layers fa-fw absolute top-24 -right-10">
                        <FontAwesomeIcon icon="circle" />
                        <FontAwesomeIcon icon="clock" className="text-violet-600" inverse transform="shrink-2" />
                    </span>
                </Popover>
            )}
        </div>
    );
};

DriverCard.propTypes = {
    isActive: PropTypes.bool,
    index: PropTypes.number,
    hasHover: PropTypes.bool,
    className: PropTypes.string,
    carNumber: PropTypes.string, // Max has a different permanentNumber than his actual car number
    driver: PropTypes.shape({
        driverId: PropTypes.string,
        permanentNumber: PropTypes.string,
        code: PropTypes.string,
        url: PropTypes.string,
        givenName: PropTypes.string,
        familyName: PropTypes.string,
        dateOfBirth: PropTypes.string,
        nationality: PropTypes.string,
    }),
    fastestLap: PropTypes.shape({
        rank: PropTypes.string,
        lap: PropTypes.string,
        time: PropTypes.shape({
            time: PropTypes.string,
        }),
        averageSpeed: PropTypes.shape({
            units: PropTypes.string,
            speed: PropTypes.string,
        }),
    }),
    grid: PropTypes.string,
    position: PropTypes.number,
    status: PropTypes.string,
    time: PropTypes.shape({
        millis: PropTypes.string,
        time: PropTypes.string,
    }),
    year: PropTypes.string,
    layoutSmall: PropTypes.bool,
};
