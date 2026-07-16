import { describe, expect, it } from 'vitest';

import type { TryItOutStateSnapshot } from '@/hooks/useTryItOutState';
import type { Operation } from '@/lib/openapi';
import { buildProxyPayload, mergeRequestHeaders } from '@/lib/proxy';

const operation: Operation = {
  id: 'getPet',
  method: 'get',
  path: '/pets/{petId}',
  tags: ['pet'],
  parameters: [
    { name: 'petId', in: 'path', required: true, schema: { type: 'string' } },
    { name: 'status', in: 'query', required: false, schema: { type: 'string' } },
    { name: 'X-Trace', in: 'header', required: false, schema: { type: 'string' } },
    { name: 'session', in: 'cookie', required: false, schema: { type: 'string' } },
  ],
  responses: [],
};

const snapshot = (overrides: Partial<TryItOutStateSnapshot> = {}): TryItOutStateSnapshot => ({
  parameters: {
    'path:petId': '42',
    'query:status': 'available',
    'header:X-Trace': 'abc',
    'cookie:session': 's1',
  },
  headers: {
    Accept: 'application/json',
    Authorization: 'Bearer token',
  },
  contentType: 'application/json',
  body: '',
  ...overrides,
});

describe('mergeRequestHeaders', () => {
  it('merges editor headers with parameter headers and cookies', () => {
    expect(mergeRequestHeaders({ operation, snapshot: snapshot() })).toEqual({
      Accept: 'application/json',
      Authorization: 'Bearer token',
      'X-Trace': 'abc',
      Cookie: 'session=s1',
    });
  });

  it('sets Content-Type for requests with a body', () => {
    const postOperation: Operation = {
      ...operation,
      id: 'createPet',
      method: 'post',
      path: '/pets',
      parameters: [],
      requestBody: {
        required: true,
        content: { 'application/json': { example: {} } },
      },
    };

    expect(
      mergeRequestHeaders({
        operation: postOperation,
        snapshot: snapshot({
          parameters: {},
          body: '{"name":"Rex"}',
          contentType: 'application/json',
        }),
      })
    ).toMatchObject({
      'Content-Type': 'application/json',
    });
  });
});

describe('buildProxyPayload', () => {
  it('builds a proxy payload with URL, headers, and no body for GET', () => {
    const result = buildProxyPayload({
      operation,
      serverUrl: 'https://petstore.swagger.io/v1',
      snapshot: snapshot(),
    });

    expect(result).toEqual({
      ok: true,
      payload: {
        method: 'get',
        url: 'https://petstore.swagger.io/v1/pets/42?status=available',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer token',
          'X-Trace': 'abc',
          Cookie: 'session=s1',
        },
        body: null,
      },
    });
  });

  it('returns a URL builder error when a path param is missing', () => {
    expect(
      buildProxyPayload({
        operation,
        serverUrl: 'https://petstore.swagger.io/v1',
        snapshot: snapshot({ parameters: { 'query:status': 'available' } }),
      })
    ).toEqual({
      ok: false,
      error: 'Missing required path parameter: petId.',
    });
  });
});
