import { describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/proxy/route';

describe('POST /api/proxy', () => {
  it('returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/proxy', {
      method: 'POST',
      body: '{broken',
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ ok: false, error: 'Request body must be valid JSON.' });
  });

  it('returns 400 for an invalid payload', async () => {
    const request = new Request('http://localhost/api/proxy', {
      method: 'POST',
      body: JSON.stringify({ method: 'get', url: '/relative' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.ok).toBe(false);
  });

  it('returns upstream result with HTTP 200 even when upstream is 404', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Not found', {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'text/plain' },
      })
    );

    const request = new Request('http://localhost/api/proxy', {
      method: 'POST',
      body: JSON.stringify({
        method: 'get',
        url: 'https://api.example.com/missing',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({
      ok: true,
      status: 404,
      statusText: 'Not Found',
      body: 'Not found',
    });

    fetchSpy.mockRestore();
  });

  it('returns 502 when upstream fetch fails', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('timeout'));

    const request = new Request('http://localhost/api/proxy', {
      method: 'POST',
      body: JSON.stringify({
        method: 'get',
        url: 'https://api.example.com/pets',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json).toEqual({ ok: false, error: 'timeout' });

    fetchSpy.mockRestore();
  });
});
