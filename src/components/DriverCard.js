import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover } from "flowbite-react";
import { useInView } from "framer-motion";

export const DriverCard = (props) => {
    const { className, carNumber, driver, fastestLap, grid, startPosition, endPosition, isActive, layoutSmall, status, time, year, hasHover, index, mobileSmall} = props;

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const positionMovement = () => {
        if ( startPosition !== endPosition ) {
            return (
                <Popover
                    aria-labelledby="default-popover"
                    className="bg-glow gradient-border p-4 bg-gray-950/60 backdrop-blur-sm"
                    trigger="hover"
                    placement="top"
                    // open={true}
                    arrow={false}
                    content={
                        <div className="p-4">
                            <div>
                                <span className="text-sm mr-4">Started</span>
                                <span className="font-display">P{startPosition}</span></div>
                            <div>
                                <span className="text-sm mr-4">Ended</span>
                                <span className="font-display">P{endPosition}</span>
                            </div>
                        </div>
                    }
                >
                    {startPosition > endPosition ? (
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon="circle" className="text-neutral-700 fa-xs" />
                            <FontAwesomeIcon icon="circle-up" inverse transform="shrink-2" className="text-emerald-500 fa-xs" />
                        </span>
                    ) : (
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon="circle" className="text-neutral-700 fa-xs" />
                            <FontAwesomeIcon icon="circle-down" inverse transform="shrink-2" className="text-rose-500 fa-xs" />
                        </span>
                    )}
                </Popover>
            )
        }
        return
    }
    
    return (
        <div className={classNames(
            className, 
            'driver-card flex items-center bg-glow gradient-border relative',
            { 'bg-glow--sm': layoutSmall},
            { 'driver-card--canvas': mobileSmall},
            isActive ? "bg-glow--active" : hasHover ? "bg-glow--hover" : ""
        )}>
            {layoutSmall ? (
                <div className={classNames("flex items-center justify-between w-full", { "max-sm:hidden": mobileSmall})}>
                    <div className="flex items-center">
                        <p className="heading-4 w-72 bg-neutral-600 ">P{endPosition}</p>
                        <span className="heading-4 pl-16">{driver.code}</span>
                    </div>
                    <p className="text-sm pr-8">{time}</p>
                </div>
            ) : (
                <div className={classNames('flex item-center w-full', { "max-sm:hidden": mobileSmall})}>
                    <p className="driver-card-position heading-1 p-8 bg-neutral-700">P{endPosition}</p>
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
            {mobileSmall && (
                <div className="sm:hidden">
                    <div className="flex items-center text-xs font-display">
                        <p className="w-24 bg-neutral-600 ">P{endPosition}</p>
                        <p className="pl-8">{driver.code}</p>
                    </div>
                    <div>
                        <p className="text-xs pl-8">{time}</p>
                    </div>
                </div>
            )}
            
            <div className="popover-wrapper flex flex-col absolute -right-10">
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
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon="circle" />
                            <FontAwesomeIcon icon="clock" className="text-violet-600" inverse transform="shrink-2" />
                        </span>
                    </Popover>
                )}
                {positionMovement()}
            </div>
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
    startPosition: PropTypes.string,
    endPosition: PropTypes.string,
    status: PropTypes.string,
    time: PropTypes.string,
    year: PropTypes.number,
    layoutSmall: PropTypes.bool,
    mobileSmall: PropTypes.bool,
};
