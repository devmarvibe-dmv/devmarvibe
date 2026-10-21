export type BackendHealth =
  | { reachable: true; status: number }
  | { reachable: false; reason: 'timeout' | 'network_blocked'; status?: number };

const ATTEMPTS = 2;
const RETRY_DELAY_MS = 1500;

async function probe(url: string, timeoutMs: number): Promise<BackendHealth> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal, mode: 'cors' });
    // Any HTTP answer — even a 500 while the console cold-starts — proves the network
    // path is open. Only a failed or timed-out request means the visitor is blocked.
    return { reachable: true, status: res.status };
  } catch (error) {
    const reason = error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'network_blocked';
    return { reachable: false, reason };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Checks whether the visitor's network can reach the console at all (e.g. not
 * blocked by a corporate firewall). Tries twice before reporting it unreachable,
 * so a single slow cold start doesn't replace the site with an error screen.
 */
export async function checkBackendReachable(url: string, timeoutMs = 10_000): Promise<BackendHealth> {
  let result: BackendHealth = { reachable: false, reason: 'network_blocked' };
  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    result = await probe(url, timeoutMs);
    if (result.reachable) return result;
    if (attempt < ATTEMPTS - 1) await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  }
  return result;
}
