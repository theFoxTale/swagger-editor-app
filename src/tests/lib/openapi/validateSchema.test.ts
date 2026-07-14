import { describe, expect, it } from 'vitest';

import { DEFAULT_SCHEMA, NEW_TAB_SCHEMA, validateSchema } from '@/lib';

describe('validateSchema', () => {
  it('accepts the default Pet Store schema', () => {
    const result = validateSchema(DEFAULT_SCHEMA);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.parsed).toMatchObject({
      openapi: '3.0.3',
      info: { title: 'Pet Store API', version: '1.0.0' },
    });
  });

  it('accepts the new tab schema', () => {
    const result = validateSchema(NEW_TAB_SCHEMA);

    expect(result.isValid).toBe(true);
    expect(result.parsed).toMatchObject({
      info: { title: 'New API', version: '1.0.0' },
    });
  });

  it('rejects schemas without openapi/swagger', () => {
    const result = validateSchema('info:\n  title: Demo\n  version: 1.0.0\n');

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing required field: openapi or swagger');
  });

  it('rejects schemas without info', () => {
    const result = validateSchema('openapi: 3.0.3\npaths: {}\n');

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing required field: info');
  });

  it('rejects schemas with invalid info title/version', () => {
    const result = validateSchema('openapi: 3.0.3\ninfo:\n  title: 1\n  version: true\n');

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        'Field "info.title" is required and must be a string',
        'Field "info.version" is required and must be a string',
      ])
    );
  });

  it('returns parse errors for broken documents', () => {
    const result = validateSchema('{');

    expect(result.isValid).toBe(false);
    expect(result.parsed).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
