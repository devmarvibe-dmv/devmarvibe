import axios from 'axios';

export const ACCODE = 'DMV';

export function createApiClient(baseURL: string) {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    if (config.method === 'get') {
      config.params = { accode: ACCODE, ...config.params };
    } else {
      config.data = { accode: ACCODE, ...(config.data ?? {}) };
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(`[api:${baseURL}]`, error?.response?.data ?? error.message);
      return Promise.reject(error);
    }
  );

  return client;
}

export const BACKEND_ORIGIN = 'https://console.devmarvibe.com';
export const BACKEND_PROBE_URL = `${BACKEND_ORIGIN}/api/services?accode=${ACCODE}`;

export const apiClient = createApiClient(`${BACKEND_ORIGIN}/api`);
