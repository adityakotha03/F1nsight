const DEFAULT_OPENF1_BACKEND_BASE_URL = "https://api.openf1.org";
const OPENF1_MIN_REQUEST_GAP_MS = 1200;
const OPENF1_CACHE_TTL_MS = 5 * 60 * 1000;
const OPENF1_MAX_RETRIES = 2;

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

let openF1Queue = Promise.resolve();
let lastOpenF1RequestAt = 0;
const openF1Cache = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildOpenF1UrlWithQuery = (path, queryParams = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        searchParams.append(key, value);
    });

    const queryString = searchParams.toString();
    return `${buildOpenF1Url(path)}${queryString ? `?${queryString}` : ""}`;
};

const enqueueOpenF1Request = (task) => {
    openF1Queue = openF1Queue.catch(() => undefined).then(task);
    return openF1Queue;
};

const fetchOpenF1Response = async (url, attempt = 0) => {
    const response = await fetch(url);

    if (response.status === 429 && attempt < OPENF1_MAX_RETRIES) {
        const retryAfter = Number(response.headers.get("retry-after")) || 0;
        const backoff = Math.max(retryAfter * 1000, OPENF1_MIN_REQUEST_GAP_MS * (attempt + 1));
        await sleep(backoff);
        return fetchOpenF1Response(url, attempt + 1);
    }

    if (!response.ok) {
        throw new Error(`OpenF1 request failed: ${response.status}`);
    }

    return response;
};

export const fetchOpenF1Json = async (path, queryParams = {}) => {
    const url = buildOpenF1UrlWithQuery(path, queryParams);
    const cached = openF1Cache.get(url);

    if (cached && Date.now() - cached.timestamp < OPENF1_CACHE_TTL_MS) {
        return cached.data;
    }

    const data = await enqueueOpenF1Request(async () => {
        const elapsed = Date.now() - lastOpenF1RequestAt;
        const waitMs = Math.max(OPENF1_MIN_REQUEST_GAP_MS - elapsed, 0);
        if (waitMs > 0) await sleep(waitMs);

        lastOpenF1RequestAt = Date.now();
        const response = await fetchOpenF1Response(url);
        return response.json();
    });

    openF1Cache.set(url, {
        data,
        timestamp: Date.now(),
    });

    return data;
};
