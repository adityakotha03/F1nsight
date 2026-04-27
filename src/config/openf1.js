const DEFAULT_OPENF1_BACKEND_BASE_URL = "/openf1";

const normalizeBackendBaseUrl = (value) => {
    const candidate = (value || DEFAULT_OPENF1_BACKEND_BASE_URL).trim();
    const withoutTrailingSlashes = candidate.replace(/\/+$/, "");

    return withoutTrailingSlashes.endsWith("/v1")
        ? withoutTrailingSlashes.replace(/\/v1$/, "")
        : withoutTrailingSlashes;
};

const isDevelopment = import.meta.env.DEV || 
                       import.meta.env.MODE === 'development' || 
                       (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

export const OPENF1_BACKEND_BASE_URL = isDevelopment 
    ? "/openf1" 
    : normalizeBackendBaseUrl(import.meta.env.VITE_APP_OPENF1_BACKEND_BASE_URL || "https://api.openf1.org");

console.log('[DEBUG] Final OPENF1_BACKEND_BASE_URL:', OPENF1_BACKEND_BASE_URL);

export const OPENF1_API_BASE_URL = `${OPENF1_BACKEND_BASE_URL}/v1`;

export const buildOpenF1Url = (path = "") => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${OPENF1_API_BASE_URL}${normalizedPath}`;
};

