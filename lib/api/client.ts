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

/** A non-2xx response, or a request that never got one (`status` 0). `data` is the parsed body when there was one. */
export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly data: Partial<ApiEnvelope<unknown>> | null) {
    super(message);
    this.name = 'ApiError';
  }
}

type Params = Record<string, string | number | boolean | undefined>;
type RequestOptions = { params?: Params };

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Small fetch-based client (replaces axios, keeping its `{ data }` result shape).
 * Adds `accode` to every request: as a query parameter on GET, in the JSON or
 * multipart body otherwise. Failed requests reject with ApiError and log nothing,
 * so a backend outage never fills a visitor's console with errors.
 */
export function createApiClient(baseURL: string) {
  async function request<T>(method: 'GET' | 'POST', path: string, params?: Params, body?: unknown): Promise<{ data: T }> {
    const url = new URL(`${baseURL}${path}`);
    if (method === 'GET') {
      Object.entries({ accode: ACCODE, ...params }).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, String(value));
      });
    }

    let payload: BodyInit | undefined;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body instanceof FormData) {
      if (!body.has('accode')) body.append('accode', ACCODE);
      payload = body;
    } else if (method !== 'GET') {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify({ accode: ACCODE, ...(body as object | undefined) });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(url, { method, headers, body: payload, signal: controller.signal });
    } catch (error) {
      throw new ApiError(error instanceof Error ? error.message : 'Network request failed', 0, null);
    } finally {
      clearTimeout(timer);
    }

    const json = await response.json().catch(() => null);
    recordApiVersion(json?.version);
    if (!response.ok) {
      throw new ApiError(json?.respdesc || `Request failed with status ${response.status}`, response.status, json);
    }
    return { data: json as T };
  }

  return {
    get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options?.params),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, options?.params, body),
  };
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
  if (error instanceof ApiError) {
    const respdesc = error.data?.respdesc;
    if (typeof respdesc === 'string' && respdesc.trim()) return respdesc;
  }
  return null;
}
