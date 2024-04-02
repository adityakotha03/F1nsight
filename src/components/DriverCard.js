import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Popover } from './Popover';

export const DriverCard = (props) => {
    const { className, carNumber, driver, fastestLap, grid, position, status, time, year} = props;
    
    return (
        <div className={classNames(className, 'driver-card flex bg-glow pl-10 gradient-border relative')}>
            <div className="flex items-stretch">
                <div className="self-center">
                    <p className="heading-1">P{position}</p>
                    <p className="text-sm -mt-4">{time}</p>
                </div>
            </div>
            <div className="flex flex-col items-center -mt-16">
                <img alt="" src={`/images/${year}/drivers/${driver.code}.png`} width={80} height={80} className="px-10"/>
                <div className="divider-glow -mb-10" /> 
                <span className="heading-4 mb-12">{driver.code}</span>
            </div>
            {fastestLap.rank === "1" && (
                <Popover content={<div className="p-2">Popover content</div>}>
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
};
