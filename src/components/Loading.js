import Lottie from 'react-lottie';
import animationData from '../lotties/loading.json';

export const Loading = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    
    return (
        <div className="mt-96">
            <Lottie 
                options={defaultOptions}
                height={200}
                width={220}
            />
        </div>
    );
}