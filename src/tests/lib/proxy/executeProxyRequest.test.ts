import { describe, expect, it, vi } from 'vitest';

import { executeProxyRequest, PROXY_API_PATH } from '@/lib/proxy';

describe('executeProxyRequest', () => {
  it('posts the payload to /api/proxy and returns the JSON result', async () => {
    const fetchImpl = vi.fn<typeof fetch>(
      async () =>
        new Response(
          JSON.stringify({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json' },
            body: '{"ok":true}',
            durationMs: 12,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    );

    const result = await executeProxyRequest(
      {
        method: 'get',
        url: 'https://api.example.com/pets',
      },
      fetchImpl
    );

    expect(fetchImpl).toHaveBeenCalledWith(
      PROXY_API_PATH,
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
      })
    );
    expect(result).toMatchObject({
      ok: true,
      status: 200,
      body: '{"ok":true}',
    });
  });

  it('returns ok:true for upstream 4xx/5xx responses from the proxy', async () => {
    const fetchImpl = vi.fn<typeof fetch>(
      async () =>
        new Response(
          JSON.stringify({
            ok: true,
            status: 404,
            statusText: 'Not Found',
            headers: { 'content-type': 'application/json' },
            body: '{"message":"missing"}',
            durationMs: 5,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    );

    const result = await executeProxyRequest(
      { method: 'get', url: 'https://api.example.com/missing' },
      fetchImpl
    );

    expect(result).toMatchObject({ ok: true, status: 404, body: '{"message":"missing"}' });
  });

  it('returns ok:false when the browser cannot reach the proxy', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new Error('offline');
    });

    await expect(
      executeProxyRequest({ method: 'get', url: 'https://api.example.com' }, fetchImpl)
    ).resolves.toEqual({ ok: false, error: 'offline' });
  });
});
