import { describe, expect, it } from 'vitest';

import { convertFormat } from '@/lib';

const yamlSchema = `openapi: 3.0.3
info:
  title: Demo API
  version: 1.0.0
paths: {}
`;

const jsonSchema = `{
  "openapi": "3.0.3",
  "info": {
    "title": "Demo API",
    "version": "1.0.0"
  },
  "paths": {}
}
`;

describe('convertFormat', () => {
  it('converts YAML to JSON without losing data', () => {
    const result = convertFormat(yamlSchema, 'yaml', 'json');
    const parsed = JSON.parse(result);

    expect(parsed).toMatchObject({
      openapi: '3.0.3',
      info: { title: 'Demo API', version: '1.0.0' },
      paths: {},
    });
  });

  it('converts JSON to YAML without losing data', () => {
    const result = convertFormat(jsonSchema, 'json', 'yaml');

    expect(result).toContain('openapi: 3.0.3');
    expect(result).toContain('title: Demo API');
    expect(result).toContain('version: 1.0.0');
  });

  it('pretty-prints JSON when formatting in place', () => {
    const compact = '{"openapi":"3.0.3","info":{"title":"Demo API","version":"1.0.0"},"paths":{}}';
    const result = convertFormat(compact, 'json', 'json');

    expect(result).toBe(jsonSchema);
  });

  it('throws when converting invalid content', () => {
    expect(() => convertFormat('{ broken', 'json', 'yaml')).toThrow();
  });
});
