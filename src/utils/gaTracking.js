import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);
};

export const trackButtonClick = (label) => {
    ReactGA.event({
        category: "Button",
        action: "Click",
        label: label,
    });
};

export const useScrollTracking = () => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            // For example, fire event at 25%, 50%, etc.
            if (scrollDepth >= 25 && scrollDepth < 26) {
                ReactGA.event({
                    category: "Scroll",
                    action: "Reached 25% scroll depth",
                });
            }
            if (scrollDepth >= 50 && scrollDepth < 51) {
                ReactGA.event({
                    category: "Scroll",
                    action: "Reached 50% scroll depth",
                });
            }
            if (scrollDepth >= 75 && scrollDepth < 76) {
                ReactGA.event({
                    category: "Scroll",
                    action: "Reached 75% scroll depth",
                });
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
};

export default useScrollTracking;