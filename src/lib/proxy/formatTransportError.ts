import type { ProxyErrorResponse } from './types';

export type ProxyTransportErrorKind = 'dns' | 'timeout' | 'network' | 'generic';

const DNS_PATTERN = /enotfound|getaddrinfo|nxdomain|err_name_not_resolved|\bdns\b/i;
const TIMEOUT_PATTERN = /timeout|etimedout|aborted|abort|timed out/i;
const NETWORK_PATTERN =
  /fetch failed|econnrefused|econnreset|enotconn|ehostunreach|enetunreach|socket|network/i;

export const getUpstreamErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'Upstream request failed.';
  }

  const cause = error.cause;
  if (cause instanceof Error && cause.message) {
    return `${error.message}: ${cause.message}`;
  }

  if (cause && typeof cause === 'object' && 'code' in cause) {
    const code = (cause as { code?: unknown }).code;
    if (typeof code === 'string' && code.trim()) {
      return `${error.message} (${code})`;
    }
  }

  return error.message || 'Upstream request failed.';
};

export const classifyProxyTransportError = (error: string): ProxyTransportErrorKind => {
  const value = error.trim();
  if (!value) {
    return 'generic';
  }
  if (DNS_PATTERN.test(value)) {
    return 'dns';
  }
  if (TIMEOUT_PATTERN.test(value)) {
    return 'timeout';
  }
  if (NETWORK_PATTERN.test(value)) {
    return 'network';
  }
  return 'generic';
};

export const getProxyTransportErrorDetail = (response: ProxyErrorResponse): string | undefined => {
  const detail = response.error.trim();
  return detail || undefined;
};
