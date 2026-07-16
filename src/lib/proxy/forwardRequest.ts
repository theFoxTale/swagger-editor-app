import { getUpstreamErrorMessage } from './formatTransportError';
import { HOP_BY_HOP_HEADERS, type ProxyRequestPayload, type ProxyResponse } from './types';

export const sanitizeOutboundHeaders = (headers: Record<string, string> | undefined): Headers => {
  const outbound = new Headers();

  if (!headers) {
    return outbound;
  }

  for (const [name, value] of Object.entries(headers)) {
    if (HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
      continue;
    }
    if (!name.trim() || !value.trim()) {
      continue;
    }
    outbound.set(name, value);
  }

  return outbound;
};

export const headersToRecord = (headers: Headers): Record<string, string> => {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
};

export const methodsWithoutBody = new Set(['get', 'head']);

export const forwardRequest = async (
  payload: ProxyRequestPayload,
  fetchImpl: typeof fetch = fetch
): Promise<ProxyResponse> => {
  const method = payload.method.toLowerCase();
  const headers = sanitizeOutboundHeaders(payload.headers);
  const startedAt = Date.now();

  try {
    const includeBody =
      payload.body !== undefined && payload.body !== null && !methodsWithoutBody.has(method);

    const response = await fetchImpl(payload.url, {
      method: method.toUpperCase(),
      headers,
      body: includeBody ? payload.body : undefined,
      redirect: 'follow',
      cache: 'no-store',
    });

    const body = await response.text();
    const durationMs = Date.now() - startedAt;

    return {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers: headersToRecord(response.headers),
      body,
      durationMs,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;

    return {
      ok: false,
      error: getUpstreamErrorMessage(error),
      durationMs,
    };
  }
};
