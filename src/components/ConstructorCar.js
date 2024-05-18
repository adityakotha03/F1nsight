import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

export const ConstructorCar = (props) => {
    const { className, points, image, name, year, drivers, index} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });


    return (
        <div 
            className={classNames(
                className, 
                'constructor-card mt-32'
            )}
            ref={ref}
        >
            <div className="flex flex-col items-center">
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
                <div className="flex items-end relative -mt-32">
                    {drivers[3] && (
                        <img 
                            alt="" 
                            className="absolute left-[-4rem]"
                            src={`${process.env.PUBLIC_URL + "/images/" + year + "/drivers/" + drivers[3] + ".png"}`}
                            width={90} 
                            style={{
                                opacity: isInView ? 1 : 0,
                                transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .4s"
                            }}
                        />
                    )}
                    <img 
                        alt="" 
                        className="-mt-40 -mr-80 sm:-mr-60"
                        src={`${process.env.PUBLIC_URL + "/images/" + year + "/drivers/" + drivers[0] + ".png"}`}
                        width={100} 
                        style={{
                            opacity: isInView ? 1 : 0,
                            transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .3s"
                        }}
                    />

                    <img 
                        alt="" 
                        className="-mt-16 -mb-32 z-10"
                        src={`${process.env.PUBLIC_URL + "/images/" + year + "/cars/" + image + ".png"}`}
                        width={264} 
                        style={{
                            transform: isInView ? "none" : "translateX(-300px)",
                            opacity: isInView ? 1 : 0,
                            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) .2s"
                        }}
                    />

                    <img 
                        alt="" 
                        className="-mt-40 -ml-80 sm:-ml-60"
                        src={`${process.env.PUBLIC_URL + "/images/" + year + "/drivers/" + drivers[1] + ".png"}`}
                        width={100} 
                        style={{
                            opacity: isInView ? 1 : 0,
                            transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .3s"
                        }}
                    />
                    {drivers[2] && (
                        <img 
                            alt="" 
                            className="absolute right-[-4rem]"
                            src={`${process.env.PUBLIC_URL + "/images/" + year + "/drivers/" + drivers[2] + ".png"}`}
                            width={90} 
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
    year: PropTypes.number,
    points: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
};