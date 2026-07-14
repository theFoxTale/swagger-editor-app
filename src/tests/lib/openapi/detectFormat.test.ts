import { describe, expect, it } from 'vitest';

import { detectFormat } from '@/lib';

describe('detectFormat', () => {
  it('detects JSON when content starts with {', () => {
    expect(detectFormat('{ "openapi": "3.0.3" }')).toBe('json');
  });

  it('detects JSON when content starts with [', () => {
    expect(detectFormat('[{"id": 1}]')).toBe('json');
  });

  it('detects YAML for typical OpenAPI documents', () => {
    expect(detectFormat('openapi: 3.0.3\ninfo:\n  title: API')).toBe('yaml');
  });

  it('defaults empty content to YAML', () => {
    expect(detectFormat('')).toBe('yaml');
    expect(detectFormat('   \n')).toBe('yaml');
  });

  it('ignores leading whitespace when detecting format', () => {
    expect(detectFormat('  \n{ "openapi": "3.0.3" }')).toBe('json');
  });
});
