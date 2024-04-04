import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover } from "flowbite-react";

export const DriverCard = (props) => {
    const { className, carNumber, driver, fastestLap, grid, position, layoutSmall, status, time, year} = props;
    
    return (
        <div className={classNames(
            className, 
            'driver-card flex bg-glow pl-10 gradient-border relative mt-16',
            { 'driver-card--small': layoutSmall}
        )}>
            {layoutSmall ? (
                <div className="flex items-center">
                    <p className="heading-4 pr-8 border-r-2 mr-8">P{position}</p>
                    <span className="heading-4 pr-8">{driver.code}</span>
                    <p className="text-sm pr-8">{time}</p>
                </div>
            ) : (
                <>
                    <div className="flex items-stretch">
                        <div className="self-center">
                            <p className="heading-1">P{position}</p>
                            <p className={classNames("text-sm -mt-4")}>{time}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center -mt-16">
                        <img alt="" src={`/images/${year}/drivers/${driver.code}.png`} width={80} height={80} className="px-10"/>
                        <div className="divider-glow -mb-10" /> 
                        <span className="heading-4 mb-12">{driver.code}</span>
                    </div>
                </>
            )}
            
            {fastestLap.rank === "1" && (
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
                    <span className="fa-layers fa-fw absolute -top-8 right-4">
                        <FontAwesomeIcon icon="circle" />
                        <FontAwesomeIcon icon="clock" className="text-violet-600" inverse transform="shrink-2" />
                    </span>
                </Popover>
            )}
        </div>
    );
};

DriverCard.propTypes = {
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
