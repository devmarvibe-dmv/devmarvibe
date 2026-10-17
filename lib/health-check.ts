export type BackendHealth =
  | { reachable: true; status: number }
  | { reachable: false; reason: 'timeout' | 'network_blocked'; status?: number };

export async function checkBackendReachable(url: string, timeoutMs = 5000): Promise<BackendHealth> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal, mode: 'cors' });
    clearTimeout(timeout);
    return res.ok ? { reachable: true, status: res.status } : { reachable: false, reason: 'network_blocked', status: res.status };
  } catch (error) {
    clearTimeout(timeout);
    const reason = error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'network_blocked';
    return { reachable: false, reason };
  }
}
