import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';

import './Modal.scss'
import classNames from 'classnames';

export const Modal = ({ isOpen, onClose, children, title, footer }) => {
    useEffect(() => {
        if (isOpen) {
          document.documentElement.classList.add("overflow-hidden");
        } else {
          document.documentElement.classList.remove("overflow-hidden");
        }
    
        return () => {
          document.documentElement.classList.remove("overflow-hidden");
        };
      }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="modal-overlay fixed top-[0] left-[0] w-full h-svh bg-glow bg-neutral-900/95 backdrop-blur-lg z-[1001] overflow-hidden" 
            onClick={onClose}
        >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className={classNames(
                    "modal-content__header p-16 flex justify-between items-center z-[1002]",
                    title ? 'bg-neutral-900/80 backdrop-blur-lg shadow-lg' : '',
                )}>
                    <div>
                        {title && (
                            <h2 className="heading-4 text-2xl text-neutral-100 text-center">
                                {title}
                            </h2>
                        )}
                    </div>
                    <button className="modal-close p-8" onClick={onClose}>
                        <FontAwesomeIcon icon="xmark" className="fa-lg" />
                    </button>
                </div>
                <div 
                    className={classNames(
                        "modal-content__content px-40",
                        footer ? 'pb-[192px]' : 'pb-[96px]',
                    )}
                >
                    {children}
                </div>
                {footer && (
                    <div className="modal-content__footer bg-neutral-900/80 backdrop-blur-lg z-[1002]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

