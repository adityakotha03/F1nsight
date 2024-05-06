import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

export const ConstructorDriver = (props) => {
    const { className, points, image, car, firstName, lastName, year} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div>
            <div 
                className={classNames(
                    className, 
                    'constructor-driver-card flex justify-center items-end',
                )}
                ref={ref}
            >
                <img 
                    alt="" 
                    className="constructor-driver-card__person -mr-28"
                    src={`${process.env.PUBLIC_URL + "/images/" + year + "/drivers/" + image + ".png"}`}
                    width={120} 
                    style={{
                        opacity: isInView ? 1 : 0,
                        transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1)"
                    }}
                />
                <div className="-mb-10">
                    <p className="gradient-text-medium uppercase text-xl tracking-wide -mb-8">{firstName}</p>
                    <p className="heading-2">{lastName}</p>
                    <div className="flex items-end">
                        <img 
                            alt="" 
                            className="constructor-driver-card__car -mb-8 z-10 -ml-32"
                            src={`${process.env.PUBLIC_URL + "/images/" + year + "/cars/" + car + ".png"}`}
                            width={200} 
                            style={{
                                transform: isInView ? "none" : "translateX(-50px)",
                                opacity: isInView ? 1 : 0,
                                transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)"
                            }}
                        />
                        <span className="heading-1 z-10">{points}</span>
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
    points: PropTypes.string || PropTypes.element,
    image: PropTypes.string,
    car: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    type: PropTypes.string,
    showDivider: PropTypes.bool,
};