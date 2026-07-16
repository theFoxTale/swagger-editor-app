import { describe, expect, it } from 'vitest';

import {
  classifyProxyTransportError,
  getUpstreamErrorMessage,
} from '@/lib/proxy/formatTransportError';

describe('classifyProxyTransportError', () => {
  it('classifies dns, timeout, network, and generic errors', () => {
    expect(classifyProxyTransportError('fetch failed (ENOTFOUND)')).toBe('dns');
    expect(classifyProxyTransportError('getaddrinfo ENOTFOUND api.example.com')).toBe('dns');
    expect(classifyProxyTransportError('request timeout')).toBe('timeout');
    expect(classifyProxyTransportError('fetch failed')).toBe('network');
    expect(classifyProxyTransportError('Upstream request failed.')).toBe('generic');
  });
});

describe('getUpstreamErrorMessage', () => {
  it('includes cause code when present', () => {
    const error = new Error('fetch failed');
    error.cause = { code: 'ENOTFOUND' };

    expect(getUpstreamErrorMessage(error)).toBe('fetch failed (ENOTFOUND)');
  });

  it('falls back to the error message', () => {
    expect(getUpstreamErrorMessage(new Error('timeout'))).toBe('timeout');
    expect(getUpstreamErrorMessage('nope')).toBe('Upstream request failed.');
  });
});
