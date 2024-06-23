import Lottie from 'react-lottie';
import classNames from 'classnames';

import animationData from '../lotties/loading.json';

export const Loading = ({className, message}) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    
    return (
        <div className={classNames(className, "loading-animation relative w-fit m-auto")}>
            <div className="loading-animation__title uppercase tracking-wide text-center pt-4 text-neutral-400">
                {message ? message : "Loading"}
            </div>
            <Lottie 
                options={defaultOptions}
                height={200}
                width={220}
            />
        </div>
    );
}