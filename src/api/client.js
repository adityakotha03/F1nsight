export const F1NSIGHT_API_BASE_URL = "https://praneeth7781.github.io/f1nsight-api-2";

const cache = {};

export const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchJsonWithCache = async (url) => {
  if (cache[url]) {
    return cache[url];
  }

  const data = await fetchJson(url);
  cache[url] = data;
  return data;
};

export const buildF1nsightApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${F1NSIGHT_API_BASE_URL}${normalizedPath}`;
};
