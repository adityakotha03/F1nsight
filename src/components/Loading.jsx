import Lottie from 'lottie-react';
import classNames from 'classnames';

import animationData from '../lotties/loading.json';

export const Loading = ({className, message}) => {
    return (
        <div className={classNames(className, "loading-animation relative w-fit m-auto")}>
            <div className="loading-animation__title uppercase tracking-wide text-center pt-4 text-neutral-400">
                {message ? message : "Loading"}
            </div>
            <Lottie 
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ height: 200, width: 220 }}
            />
        </div>
    );
}
