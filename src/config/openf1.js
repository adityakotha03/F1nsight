const DEFAULT_OPENF1_BACKEND_BASE_URL = "https://f1.adityakotha.xyz";

const normalizeBackendBaseUrl = (value) => {
    const candidate = (value || DEFAULT_OPENF1_BACKEND_BASE_URL).trim();
    const withoutTrailingSlashes = candidate.replace(/\/+$/, "");

    return withoutTrailingSlashes.endsWith("/v1")
        ? withoutTrailingSlashes.replace(/\/v1$/, "")
        : withoutTrailingSlashes;
};

export const OPENF1_BACKEND_BASE_URL = normalizeBackendBaseUrl(
    process.env.REACT_APP_OPENF1_BACKEND_BASE_URL
);

export const OPENF1_API_BASE_URL = `${OPENF1_BACKEND_BASE_URL}/v1`;

export const buildOpenF1Url = (path = "") => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${OPENF1_API_BASE_URL}${normalizedPath}`;
};
