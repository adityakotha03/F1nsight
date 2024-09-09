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
        label: {label},
    });
};
