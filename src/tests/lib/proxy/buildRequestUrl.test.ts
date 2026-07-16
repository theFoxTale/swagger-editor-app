import { describe, expect, it } from 'vitest';

import type { OperationParameter } from '@/lib/openapi';
import { buildRequestUrl, joinServerAndPath, resolveServerUrl } from '@/lib/proxy/buildRequestUrl';

describe('joinServerAndPath', () => {
  it('joins base and path without dropping server path segments', () => {
    expect(joinServerAndPath('https://api.example.com/v1', '/pets')).toBe(
      'https://api.example.com/v1/pets'
    );
    expect(joinServerAndPath('https://api.example.com/v1/', 'pets/{id}')).toBe(
      'https://api.example.com/v1/pets/{id}'
    );
  });
});

describe('resolveServerUrl', () => {
  it('normalizes absolute URLs and resolves relative ones with origin', () => {
    expect(resolveServerUrl('https://api.example.com/v1/')).toBe('https://api.example.com/v1');
    expect(resolveServerUrl('/api', 'https://app.example.com')).toBe('https://app.example.com/api');
    expect(resolveServerUrl('/api')).toBeNull();
    expect(resolveServerUrl('not a url')).toBeNull();
  });
});

describe('buildRequestUrl', () => {
  const parameters: OperationParameter[] = [
    { name: 'petId', in: 'path', required: true, schema: { type: 'string' } },
    { name: 'status', in: 'query', required: false, schema: { type: 'string' } },
    { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
  ];

  it('builds a URL with path and query parameters', () => {
    const result = buildRequestUrl({
      serverUrl: 'https://petstore.swagger.io/v1',
      path: '/pets/{petId}',
      parameters,
      values: {
        'path:petId': '42',
        'query:status': 'available',
        'query:limit': '10',
        'header:X-Ignored': 'nope',
      },
    });

    expect(result).toEqual({
      ok: true,
      url: 'https://petstore.swagger.io/v1/pets/42?status=available&limit=10',
    });
  });

  it('encodes path and query values', () => {
    const result = buildRequestUrl({
      serverUrl: 'https://api.example.com',
      path: '/search/{term}',
      values: {
        'path:term': 'a b/c',
        'query:q': 'hello world',
      },
    });

    expect(result).toEqual({
      ok: true,
      url: 'https://api.example.com/search/a%20b%2Fc?q=hello+world',
    });
  });

  it('fails when a required path parameter is missing', () => {
    expect(
      buildRequestUrl({
        serverUrl: 'https://api.example.com',
        path: '/pets/{petId}',
        parameters,
        values: {},
      })
    ).toEqual({
      ok: false,
      error: 'Missing required path parameter: petId.',
    });
  });

  it('skips empty query values', () => {
    const result = buildRequestUrl({
      serverUrl: 'https://api.example.com',
      path: '/pets',
      parameters: [
        { name: 'status', in: 'query', required: false, schema: { type: 'string' } },
        { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
      ],
      values: {
        'query:status': '',
        'query:limit': '5',
      },
    });

    expect(result).toEqual({
      ok: true,
      url: 'https://api.example.com/pets?limit=5',
    });
  });

  it('resolves a relative server URL when origin is provided', () => {
    const result = buildRequestUrl({
      serverUrl: '/proxy-api',
      origin: 'http://localhost:3000',
      path: '/health',
      values: {},
    });

    expect(result).toEqual({
      ok: true,
      url: 'http://localhost:3000/proxy-api/health',
    });
  });
});
