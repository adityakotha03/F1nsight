import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { initializeGoogleAnalytics } from "../utils/analytics";
import "./CookieBanner.css";

const GA_ID = "G-10L7RPCBYS";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    } else if (consent === "accepted") {
      initializeGoogleAnalytics(GA_ID);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
    initializeGoogleAnalytics(GA_ID);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="cookie-consent-banner">
      <div className="cookie-top-row">
        <div className="cookie-content">
          <h3>We use cookies</h3>
          <p>
            This website uses cookies to ensure you get the best experience on
            our website.
          </p>
          <p className="cookie-analytics-note">
            We use Google Analytics to analyze traffic.
          </p>
        </div>
        <div className="cookie-actions">
          <button onClick={handleReject} className="cookie-btn reject">
            Reject
          </button>
          <button onClick={handleAccept} className="cookie-btn accept">
            Accept
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CookieBanner;
