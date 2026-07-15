import type { ProxyRequestPayload, ProxyResponse } from './types';

export const PROXY_API_PATH = '/api/proxy';

export const executeProxyRequest = async (
  payload: ProxyRequestPayload,
  fetchImpl: typeof fetch = fetch
): Promise<ProxyResponse> => {
  let response: Response;

  try {
    response = await fetchImpl(PROXY_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reach the proxy.';
    return { ok: false, error: message };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return { ok: false, error: 'Proxy returned an invalid JSON response.' };
  }

  if (
    typeof json === 'object' &&
    json !== null &&
    'ok' in json &&
    typeof (json as { ok: unknown }).ok === 'boolean'
  ) {
    return json as ProxyResponse;
  }

  return { ok: false, error: 'Proxy returned an unexpected response.' };
};
