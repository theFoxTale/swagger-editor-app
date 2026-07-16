import { describe, expect, it, vi } from 'vitest';

import {
  buildRequestHistoryRecord,
  estimateRequestSize,
  getUtf8ByteLength,
  recordRequestAnalytics,
} from '@/lib/history/analytics';

describe('history analytics helpers', () => {
  it('estimates request and response byte sizes', () => {
    expect(getUtf8ByteLength('abc')).toBe(3);
    expect(
      estimateRequestSize({
        method: 'post',
        url: 'https://api.example.com/pets',
        headers: { Accept: 'application/json' },
        body: '{"name":"Rex"}',
      })
    ).toBeGreaterThan(0);
  });

  it('builds a success analytics record', () => {
    const record = buildRequestHistoryRecord({
      userId: 'user-1',
      payload: {
        method: 'get',
        url: 'https://api.example.com/pets',
        headers: { Accept: 'application/json' },
      },
      result: {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        body: '[]',
        durationMs: 12,
      },
    });

    expect(record).toMatchObject({
      user_id: 'user-1',
      method: 'GET',
      endpoint: 'https://api.example.com/pets',
      status: 200,
      request_duration: 12,
      response_size: 2,
      error: null,
    });
    expect(record.request_size).toBeGreaterThan(0);
    expect(record.timestamp).toBeTruthy();
  });

  it('stores upstream 4xx details in the error field', () => {
    const record = buildRequestHistoryRecord({
      userId: 'user-1',
      payload: { method: 'get', url: 'https://api.example.com/missing' },
      result: {
        ok: true,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        body: 'missing',
        durationMs: 8,
      },
    });

    expect(record.status).toBe(404);
    expect(record.error).toBe('Not Found');
  });

  it('builds a transport-error analytics record', () => {
    const record = buildRequestHistoryRecord({
      userId: 'user-1',
      payload: { method: 'get', url: 'https://api.example.com/pets' },
      result: { ok: false, error: 'timeout', durationMs: 3 },
    });

    expect(record).toMatchObject({
      status: 0,
      response_size: 0,
      error: 'timeout',
      request_duration: 3,
    });
  });

  it('inserts analytics through supabase', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const supabase = {
      from: vi.fn(() => ({ insert })),
    };

    await recordRequestAnalytics(supabase as never, {
      user_id: 'user-1',
      timestamp: '2026-07-16T00:00:00.000Z',
      method: 'GET',
      endpoint: 'https://api.example.com/pets',
      status: 200,
      request_duration: 10,
      request_size: 20,
      response_size: 2,
      error: null,
    });

    expect(supabase.from).toHaveBeenCalledWith('request_history');
    expect(insert).toHaveBeenCalled();
  });
});
