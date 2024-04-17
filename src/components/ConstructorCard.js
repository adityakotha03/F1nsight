import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useInView } from "framer-motion";

export const ConstructorCard = (props) => {
    const { className, points, image, name, year, type} = props;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div 
            className={classNames(
                className, 
                'constructor-card flex items-center bg-glow gradient-border relative my-32 w-fit mx-auto'
            )}
            ref={ref}
        >
            <div className='flex flex-col items-center px-10'>
                <div
                    style={{
                        transform: isInView ? "none" : type === 'cars' && "translateX(-100px)",
                        opacity: isInView ? 1 : 0,
                        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
                    }}
                >
                    <img 
                        alt="" 
                        className={classNames({ '-mt-32' : type === 'drivers' })}
                        height={type === 'cars' ? 85 : 120} 
                        src={`/images/${year}/${type}/${image}.png`} 
                        width={type === 'cars' ? 288 : 120} 
                    />
                    <div className={classNames("divider-glow", { '-mt-16' : type === 'cars' })} /> 
                </div>
                <p className="heading-4 mb-16">{name}</p>
            </div>
            <div className="bg-gradient-to-b from-neutral-700/30 to-neutral-500/30 self-stretch w-72 flex items-center justify-center">
                <span className="heading-2">{points}</span>
            </div>
        </div>
    );
};

ConstructorCard.propTypes = {
    className: PropTypes.string,
    year: PropTypes.string,
    points: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
};