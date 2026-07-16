import { describe, expect, it } from 'vitest';

import { generateCurl } from '@/lib/proxy';

describe('generateCurl', () => {
  it('builds a GET command with headers', () => {
    expect(
      generateCurl({
        method: 'get',
        url: 'https://api.example.com/pets?status=available',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer token',
        },
        body: null,
      })
    ).toBe(
      "curl -X GET 'https://api.example.com/pets?status=available' -H 'Accept: application/json' -H 'Authorization: Bearer token'"
    );
  });

  it('builds a POST command with body and content type', () => {
    expect(
      generateCurl({
        method: 'post',
        url: 'https://api.example.com/pets',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"name":"Rex"}',
      })
    ).toBe(
      `curl -X POST 'https://api.example.com/pets' -H 'Content-Type: application/json' --data-raw '{"name":"Rex"}'`
    );
  });

  it('escapes single quotes in URL, headers, and body', () => {
    expect(
      generateCurl({
        method: 'post',
        url: "https://api.example.com/pets?name=O'Brien",
        headers: {
          'X-Note': "it's fine",
        },
        body: `{"name":"O'Brien"}`,
      })
    ).toBe(
      `curl -X POST 'https://api.example.com/pets?name=O'"'"'Brien' -H 'X-Note: it'"'"'s fine' --data-raw '{"name":"O'"'"'Brien"}'`
    );
  });

  it('skips empty headers and omits body for blank payloads', () => {
    expect(
      generateCurl({
        method: 'get',
        url: 'https://api.example.com/pets',
        headers: {
          Accept: 'application/json',
          'X-Empty': '   ',
        },
        body: '   ',
      })
    ).toBe("curl -X GET 'https://api.example.com/pets' -H 'Accept: application/json'");
  });
});
