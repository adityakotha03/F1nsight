import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover } from "flowbite-react";
import { useInView } from "framer-motion";

export const RaceResultItem = (props) => {
    const { championshipLevel, className, driver, driverColor, fastestLap, startPosition, endPosition, isActive, layoutSmall, time, year, hasHover, index, mobileSmall, status} = props;

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // console.log({driver})
    
    return (
        <li 
            className={classNames(
                className, 
                'driver-card flex items-end relative mt-[9rem]',
                {"hidden": status === "cancelled"},
            )}
            style={{borderColor: isActive && `#${driverColor}`}}
        >
            <div className={classNames('flex item-center w-full', { "max-md:hidden": mobileSmall})}>
                <img 
                    alt="" 
                    src={
                        championshipLevel === 'F1A' || championshipLevel === 'F2' ?
                        `${process.env.PUBLIC_URL + "/images/" + year + "/" + championshipLevel +"/" + driver.code + ".png"}` :
                        `${process.env.PUBLIC_URL + "/images/" + year + "/drivers/" + driver.code + ".png"}`
                    }
                    width={72} 
                    height={72} 
                    ref={ref}
                    style={{
                        opacity: isInView ? 1 : 0,
                        transition: `all 1s cubic-bezier(0.17, 0.55, 0.55, 1) .${index}s`
                    }}
                />
                <div className="stand bg-glow px-14 text-center">
                    <div className="font-display text-[1.8rem] ">
                        <span className="text-neutral-500">P{endPosition}</span> {driver.code}
                    </div>
                    <div className="divider-glow w-full" /> 
                    <div className="text-sm -mt-8 flex items-center justify-center gap-4">
                        {time}
                        <span className="popover-wrapper flex flex-col items-center">
                            {fastestLap?.rank === "1" && (
                                <Popover
                                    aria-labelledby="default-popover"
                                    className="bg-glow border-2 border-plum-500 p-4 bg-neutral-950 z-[10] rounded-md"
                                    trigger="hover"
                                    placement="top"
                                    // open={true}
                                    arrow={false}
                                    content={
                                        <div className="p-4">
                                            <div className="bg-plum-500 text-center font-display rounded-sm">
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

                                            {fastestLap?.AverageSpeed && (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm">Avg Speed</span>
                                                    <div>
                                                        <span className="font-display">{fastestLap?.AverageSpeed?.speed}</span>
                                                        <span className="text-sm">{fastestLap?.AverageSpeed?.units}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    }
                                >
                                    <span className="fa-layers fa-fw fa-xs">
                                        <FontAwesomeIcon icon="circle"  />
                                        <FontAwesomeIcon icon="clock" className="text-plum-500" inverse transform="shrink-2" />
                                    </span>
                                </Popover>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );
};

RaceResultItem.propTypes = {
    isActive: PropTypes.bool,
    index: PropTypes.number,
    hasHover: PropTypes.bool,
    className: PropTypes.string,
    carNumber: PropTypes.string, // Max has a different permanentNumber than his actual car number
    driverColor: PropTypes.string,
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
    startPosition: PropTypes.number,
    endPosition: PropTypes.number,
    status: PropTypes.string,
    time: PropTypes.string,
    year: PropTypes.number,
    layoutSmall: PropTypes.bool,
    mobileSmall: PropTypes.bool,
};
