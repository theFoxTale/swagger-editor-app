import { describe, expect, it } from 'vitest';

import { isAllowedProxyUrl, validateProxyRequest } from '@/lib/proxy';

describe('isAllowedProxyUrl', () => {
  it('accepts absolute http and https URLs', () => {
    expect(isAllowedProxyUrl('https://api.example.com/pets')).toBe(true);
    expect(isAllowedProxyUrl('http://localhost:3000/api')).toBe(true);
  });

  it('rejects non-http schemes and relative URLs', () => {
    expect(isAllowedProxyUrl('/pets')).toBe(false);
    expect(isAllowedProxyUrl('ftp://files.example.com/a')).toBe(false);
    expect(isAllowedProxyUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedProxyUrl('not a url')).toBe(false);
  });
});

describe('validateProxyRequest', () => {
  it('accepts a valid request payload', () => {
    const result = validateProxyRequest({
      method: 'POST',
      url: 'https://api.example.com/pets',
      headers: { Accept: 'application/json' },
      body: '{"name":"Rex"}',
    });

    expect(result).toEqual({
      valid: true,
      payload: {
        method: 'post',
        url: 'https://api.example.com/pets',
        headers: { Accept: 'application/json' },
        body: '{"name":"Rex"}',
      },
    });
  });

  it('rejects missing or invalid method', () => {
    expect(validateProxyRequest({ url: 'https://api.example.com' })).toEqual({
      valid: false,
      error: 'Field "method" is required.',
    });
    expect(validateProxyRequest({ method: 'CONNECT', url: 'https://api.example.com' })).toEqual({
      valid: false,
      error: 'Unsupported HTTP method: CONNECT.',
    });
  });

  it('rejects missing or invalid url', () => {
    expect(validateProxyRequest({ method: 'get' })).toEqual({
      valid: false,
      error: 'Field "url" is required.',
    });
    expect(validateProxyRequest({ method: 'get', url: '/relative' })).toEqual({
      valid: false,
      error: 'Field "url" must be an absolute http or https URL.',
    });
  });

  it('rejects invalid headers and body shapes', () => {
    expect(
      validateProxyRequest({
        method: 'get',
        url: 'https://api.example.com',
        headers: 'Accept: application/json',
      })
    ).toEqual({
      valid: false,
      error: 'Field "headers" must be an object.',
    });

    expect(
      validateProxyRequest({
        method: 'post',
        url: 'https://api.example.com',
        body: { name: 'Rex' },
      })
    ).toEqual({
      valid: false,
      error: 'Field "body" must be a string or null.',
    });
  });
});
