import { describe, expect, it } from 'vitest';

import { parseSchemaContent } from '@/lib';

describe('parseSchemaContent', () => {
  it('returns an error for empty content', () => {
    expect(parseSchemaContent('  ', 'yaml')).toEqual({
      data: null,
      error: 'Schema is empty',
    });
  });

  it('parses valid YAML schemas', () => {
    const result = parseSchemaContent(
      'openapi: 3.0.3\ninfo:\n  title: Demo\n  version: 1.0.0\n',
      'yaml'
    );

    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({
      openapi: '3.0.3',
      info: { title: 'Demo', version: '1.0.0' },
    });
  });

  it('parses valid JSON schemas', () => {
    const result = parseSchemaContent(
      JSON.stringify({
        openapi: '3.0.3',
        info: { title: 'Demo', version: '1.0.0' },
      }),
      'json'
    );

    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({
      openapi: '3.0.3',
      info: { title: 'Demo', version: '1.0.0' },
    });
  });

  it('rejects JSON arrays', () => {
    const result = parseSchemaContent('[1, 2]', 'json');

    expect(result.data).toBeNull();
    expect(result.error).toBe('OpenAPI schema must be a JSON object');
  });

  it('returns a parse error for invalid JSON', () => {
    const result = parseSchemaContent('{ broken', 'json');

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
  });
});
