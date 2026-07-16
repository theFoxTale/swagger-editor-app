import { describe, expect, it, vi } from 'vitest';

import { forwardRequest, sanitizeOutboundHeaders } from '@/lib/proxy';

describe('sanitizeOutboundHeaders', () => {
  it('strips hop-by-hop headers and empty values', () => {
    const headers = sanitizeOutboundHeaders({
      Accept: 'application/json',
      Host: 'evil.example.com',
      Connection: 'keep-alive',
      Authorization: 'Bearer token',
      'X-Empty': '   ',
    });

    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer token');
    expect(headers.get('Host')).toBeNull();
    expect(headers.get('Connection')).toBeNull();
    expect(headers.get('X-Empty')).toBeNull();
  });
});

describe('forwardRequest', () => {
  it('forwards the request and returns status, headers, body, and duration', async () => {
    const fetchImpl = vi.fn<typeof fetch>(
      async () =>
        new Response('{"id":1}', {
          status: 201,
          statusText: 'Created',
          headers: { 'Content-Type': 'application/json', 'X-Request-Id': 'abc' },
        })
    );

    const result = await forwardRequest(
      {
        method: 'post',
        url: 'https://api.example.com/pets',
        headers: { Accept: 'application/json', Host: 'should-be-stripped' },
        body: '{"name":"Rex"}',
      },
      fetchImpl
    );

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.example.com/pets',
      expect.objectContaining({
        method: 'POST',
        body: '{"name":"Rex"}',
        cache: 'no-store',
      })
    );

    const callInit = fetchImpl.mock.calls[0]?.[1];
    const callHeaders = callInit?.headers as Headers;
    expect(callHeaders.get('Accept')).toBe('application/json');
    expect(callHeaders.get('Host')).toBeNull();

    expect(result).toMatchObject({
      ok: true,
      status: 201,
      statusText: 'Created',
      body: '{"id":1}',
      headers: {
        'content-type': 'application/json',
        'x-request-id': 'abc',
      },
    });
    if (result.ok) {
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('omits body for GET requests', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response('ok', { status: 200 }));

    await forwardRequest(
      {
        method: 'get',
        url: 'https://api.example.com/pets',
        body: 'should-not-send',
      },
      fetchImpl
    );

    expect(fetchImpl.mock.calls[0]?.[1]?.body).toBeUndefined();
  });

  it('returns ok:false when the upstream fetch fails', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new Error('network down');
    });

    const result = await forwardRequest(
      { method: 'get', url: 'https://api.example.com/pets' },
      fetchImpl
    );

    expect(result).toEqual({ ok: false, error: 'network down' });
  });
});
