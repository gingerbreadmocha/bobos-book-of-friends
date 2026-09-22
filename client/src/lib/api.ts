/**
 * Base URL for API requests.
 *
 * In dev the Vite server proxies `/api`, so this stays empty and requests hit
 * the same origin. In production (e.g. Netlify) there is no proxy, so the
 * build-time target is baked in to point the client at the real API server.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_PROXY_TARGET ?? "").replace(/\/+$/, "");