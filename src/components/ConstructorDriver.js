import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

import { wildCardDrivers } from '../utils/wildCards';

export const ConstructorDriver = (props) => {
    const { className, points, image, car, firstName, lastName, year, index, showStanding, championshipLevel} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const F2F1A = championshipLevel === "F1A" || championshipLevel === "F2" 
 
    const f2ImageSrc = `${process.env.PUBLIC_URL + "/images/" + year + "/F2/carSideView/" + car + ".png"}`
    const f1aImageSrc = wildCardDrivers[year].includes(image) 
        ? `${process.env.PUBLIC_URL + "/images/2024/F1A/carSideView/wildcard-side.png"}`
        : `${process.env.PUBLIC_URL + "/images/" + year + "/F1A/carSideView/" + image + "-side.png"}`;
    const imageSrc = `${process.env.PUBLIC_URL + "/images/" + year + "/cars/" + car + ".png"}`;

    return (
        <div>
            <div 
                className={classNames(
                    className, 
                    'constructor-driver-card flex justify-center items-end relative',
                )}
                ref={ref}
            >
                <img 
                    alt="" 
                    className="constructor-driver-card__person -mr-28 w-[12rem] z-[0] rounded-t-lg"
                    src={F2F1A ? 
                        `${process.env.PUBLIC_URL + "/images/" + year + "/" + championshipLevel + "/" + image + ".png"}` 
                        : `${process.env.PUBLIC_URL + "/images/" + year + "/drivers/" + image + ".png"}`}
                    style={{
                        opacity: isInView ? 1 : 0,
                        transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1)"
                    }}
                />
                {championshipLevel === "F1A" && wildCardDrivers[year].includes(image) && (
                    <img 
                        alt=''
                        className="absolute left-[4rem] md:left-[6.4rem] bottom-[-1rem] w-64"
                        src={`${process.env.PUBLIC_URL + "/images/wildcardicon.png"}`}
                    />
                )}
                <div className="-mb-10 relative z-10">
                    {/* position / firstname */}
                    <div className="w-fit mb-4">
                        {showStanding && (
                            <div div className="flex items-end mb-4">
                                <div className="font-display text-24 leading-none -mb-4 mr-8 text-neutral-400">
                                    {index + 1}
                                </div>
                                <div className="h-1 w-full border-b-[1px] border-solid border-neutral-600 mr-8" />
                            </div>
                        )}
                        <p className="gradient-text-light uppercase text-xl tracking-wide -mb-8">{firstName}</p>
                    </div>
                    {/* last name */}
                    <p className="heading-2 mb-6">{lastName}</p>
                    <div className="h-1 w-full border-b-[1px] border-solid border-neutral-600" />
                    {/* car / points */}
                    <div className="flex items-end">
                        <img 
                            alt="" 
                            className="constructor-driver-card__car -mb-8 z-10 -ml-32 w-[20rem]"
                            src={championshipLevel === "F1A" ? f1aImageSrc 
                                : championshipLevel === "F2" ? f2ImageSrc 
                                : imageSrc}
                            width={200} 
                            style={{
                                transform: isInView ? "none" : championshipLevel === "F2" ? "translateX(50px)" : "translateX(-50px)",
                                opacity: isInView ? 1 : 0,
                                transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)"
                            }}
                        />
                        <span className="font-display text-[4.8rem] leading-none z-10 gradient-text-light">{points}</span>
                    </div>
                </div>
            </div>
            <div className="divider-glow-dark w-full" />
        </div>
    );
};

ConstructorDriver.propTypes = {
    className: PropTypes.string,
    year: PropTypes.number,
    points: PropTypes.object || PropTypes.element,
    image: PropTypes.string,
    car: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    type: PropTypes.string,
    showDivider: PropTypes.bool,
};