/**
 * Dynamically initializes Google Analytics (gtag.js)
 * @param {string} trackingId - The Google Analytics Measurement ID (e.g., 'G-XXXXXXX')
 */
export const initializeGoogleAnalytics = (trackingId) => {
  if (!trackingId) return;

  // Avoid duplicate initialization
  if (window.gtag) {
    console.log('[Analytics] Already initialized');
    return;
  }

  // Inject Google Tag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', trackingId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log(`[Analytics] Initialized with ID: ${trackingId}`);
};
