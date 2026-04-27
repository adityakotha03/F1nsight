import React, { useEffect, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import "./ReloadPrompt.css";

function ReloadPrompt() {
  const registrationRef = useRef(null);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        console.log("SW Registered");
        registrationRef.current = r;
      }
    },
    onRegisterError(error) {
      console.error("SW Registration Error:", error);
    },
  });

  // Handle periodic checks and visibility changes
  useEffect(() => {
    const checkUpdate = () => {
      if (registrationRef.current) {
        console.log("Checking for PWA updates...");
        registrationRef.current
          .update()
          .catch((err) => console.error("Periodic SW update error:", err));
      }
    };

    // Check for updates every 30 seconds (less aggressive)
    const intervalId = setInterval(checkUpdate, 30 * 1000);

    // Check for updates when the user switches back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkUpdate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (offlineReady || needRefresh) {
      console.log(
        "PWA Status - offlineReady:",
        offlineReady,
        "needRefresh:",
        needRefresh,
      );
    }
  }, [offlineReady, needRefresh]);

  const handleReload = async () => {
    console.log("Requesting SW update...");
    // updateServiceWorker(true) sends skipWaiting and then reloads the page
    // automatically when the new service worker takes control.
    await updateServiceWorker(true);
  };

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="ReloadPrompt-container">
      <div className="ReloadPrompt-toast">
        <div className="ReloadPrompt-message">
          {needRefresh ? (
            <span>New version available! Click reload for latest data.</span>
          ) : (
            <span>App is ready to work offline.</span>
          )}
        </div>
        <div className="ReloadPrompt-actions">
          {needRefresh && (
            <button
              className="ReloadPrompt-toast-button primary"
              onClick={handleReload}
            >
              Reload
            </button>
          )}
          <button className="ReloadPrompt-toast-button" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReloadPrompt;
