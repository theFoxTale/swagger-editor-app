import { describe, expect, it } from 'vitest';

import {
  formatJsonValue,
  getMediaTypeExample,
  getRequestBodyContentTypes,
  getResponseStatusTone,
  getSchemaTypeLabel,
  sortResponses,
} from '@/components/Viewer/schemaUtils';

describe('schemaUtils', () => {
  it('formats schema type labels', () => {
    expect(getSchemaTypeLabel()).toBe('—');
    expect(getSchemaTypeLabel({ type: 'string', format: 'uuid' })).toBe('string (uuid)');
    expect(getSchemaTypeLabel({ type: 'array', items: { type: 'integer' } })).toBe(
      'array<integer>'
    );
    expect(getSchemaTypeLabel({ $ref: '#/components/schemas/Pet' })).toBe('Pet');
  });

  it('formats JSON values compactly or pretty', () => {
    expect(formatJsonValue(undefined)).toBeNull();
    expect(formatJsonValue('plain')).toBe('plain');
    expect(formatJsonValue({ a: 1 })).toBe('{"a":1}');
    expect(formatJsonValue({ a: 1 }, true)).toBe('{\n  "a": 1\n}');
  });

  it('picks examples from media type objects', () => {
    expect(getMediaTypeExample({ example: { id: 1 } })).toEqual({ id: 1 });
    expect(
      getMediaTypeExample({
        examples: { sample: { value: { name: 'Rex' } } },
      })
    ).toEqual({ name: 'Rex' });
    expect(getMediaTypeExample({ schema: { example: 'from-schema' } })).toBe('from-schema');
  });

  it('lists request body content types', () => {
    expect(
      getRequestBodyContentTypes({
        required: true,
        content: {
          'application/json': {},
          'text/plain': {},
        },
      })
    ).toEqual(['application/json', 'text/plain']);
  });

  it('sorts responses and maps status tones', () => {
    expect(
      sortResponses([{ statusCode: 'default' }, { statusCode: '404' }, { statusCode: '200' }]).map(
        (item) => item.statusCode
      )
    ).toEqual(['200', '404', 'default']);

    expect(getResponseStatusTone('200')).toBe('success');
    expect(getResponseStatusTone('404')).toBe('clientError');
    expect(getResponseStatusTone('500')).toBe('serverError');
    expect(getResponseStatusTone('default')).toBe('default');
  });
});
