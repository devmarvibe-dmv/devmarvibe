import axios from 'axios';

export const ACCODE = 'DMV';

/** Every DMV Console response uses this envelope; `respcode` matches the HTTP status. */
export type ApiEnvelope<T> = {
  success: boolean;
  respcode: number;
  respdesc: string;
  data: T;
  /** DMV Console release that served the response, e.g. "1.66.0". */
  version?: string;
};

/** A paged list response (projects, products, services, journeys). */
export type ApiPage<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

let apiVersion: string | null = null;
const versionListeners = new Set<(version: string) => void>();

function recordApiVersion(version: unknown) {
  if (typeof version !== 'string' || !version || version === apiVersion) return;
  apiVersion = version;
  versionListeners.forEach((listener) => listener(version));
}

export function getApiVersion(): string | null {
  return apiVersion;
}

/** Calls `listener` whenever a response reports a new console version. Returns an unsubscribe function. */
export function onApiVersion(listener: (version: string) => void): () => void {
  versionListeners.add(listener);
  return () => versionListeners.delete(listener);
}

export function createApiClient(baseURL: string) {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    if (config.method === 'get') {
      config.params = { accode: ACCODE, ...config.params };
    } else if (config.data instanceof FormData) {
      if (!config.data.has('accode')) config.data.append('accode', ACCODE);
    } else {
      config.data = { accode: ACCODE, ...(config.data ?? {}) };
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      recordApiVersion(response.data?.version);
      return response;
    },
    (error) => {
      recordApiVersion(error?.response?.data?.version);
      console.error(`[api:${baseURL}]`, error?.response?.data ?? error.message);
      return Promise.reject(error);
    }
  );

  return client;
}

const DEFAULT_BACKEND_ORIGIN = 'https://console.devmarvibe.com';

/** DMV Console host, without `/api`. Set NEXT_PUBLIC_BACKEND_URL to point UAT or local builds at another console. */
export const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || DEFAULT_BACKEND_ORIGIN)
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');
export const BACKEND_PROBE_URL = `${BACKEND_ORIGIN}/api/services?accode=${ACCODE}`;

export const apiClient = createApiClient(`${BACKEND_ORIGIN}/api`);

/** Console file paths like `/api/files/F-001` are relative to the API host; full URLs pass through unchanged. */
export function resolveFileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** The `respdesc` of a failed call, when the console sent one — safe to show to visitors. */
export function getApiErrorMessage(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const respdesc = (error.response?.data as Partial<ApiEnvelope<unknown>> | undefined)?.respdesc;
    if (typeof respdesc === 'string' && respdesc.trim()) return respdesc;
  }
  return null;
}
