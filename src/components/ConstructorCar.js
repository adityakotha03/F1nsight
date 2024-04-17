import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

export const ConstructorCar = (props) => {
    const { className, points, image, name, year, type} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div 
            className={classNames(
                className, 
                'constructor-card mt-64'
            )}
            ref={ref}
        >
            <div className="flex flex-col items-center">
                <p className="heading-4 -mb-4 constructor-title gradient-text-dark">{name}</p>
                <span className="heading-1">{points}</span>
                <img 
                    alt="" 
                    className="-mt-16 -mb-32"
                    height={85} 
                    src={`/images/${year}/${type}/${image}.png`} 
                    width={type === 'cars' ? 288 : 120} 
                    style={{
                        transform: isInView ? "none" : "translateX(-100px)",
                        opacity: isInView ? 1 : 0,
                        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
                    }}
                />
            </div>
            <div className="divider-glow-dark w-full" />
        </div>
    );
};

ConstructorCar.propTypes = {
    className: PropTypes.string,
    year: PropTypes.string,
    points: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
};