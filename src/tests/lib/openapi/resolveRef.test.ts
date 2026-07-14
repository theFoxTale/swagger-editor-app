import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SCHEMA,
  isLocalRef,
  resolveJsonPointer,
  resolveSchema,
  validateSchema,
} from '@/lib/openapi';

const petStoreDocument = validateSchema(DEFAULT_SCHEMA).parsed as Record<string, unknown>;

describe('isLocalRef', () => {
  it('detects local JSON Pointer refs', () => {
    expect(isLocalRef('#/components/schemas/Pet')).toBe(true);
    expect(isLocalRef('https://example.com/schemas/Pet.json')).toBe(false);
  });
});

describe('resolveJsonPointer', () => {
  it('resolves component schema pointers', () => {
    expect(resolveJsonPointer(petStoreDocument, '#/components/schemas/Pet')).toMatchObject({
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        tag: { type: 'string' },
      },
    });
  });

  it('returns undefined for missing pointers', () => {
    expect(resolveJsonPointer(petStoreDocument, '#/components/schemas/Missing')).toBeUndefined();
  });
});

describe('resolveSchema', () => {
  it('expands a top-level $ref to the component schema', () => {
    const resolved = resolveSchema({ $ref: '#/components/schemas/Pet' }, petStoreDocument);

    expect(resolved).toMatchObject({
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    });
    expect(resolved).not.toHaveProperty('$ref');
  });

  it('expands nested $ref values in array items', () => {
    const resolved = resolveSchema(
      {
        type: 'array',
        items: { $ref: '#/components/schemas/Pet' },
      },
      petStoreDocument
    );

    expect(resolved).toMatchObject({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    });
  });

  it('keeps circular refs as $ref markers', () => {
    const document = {
      components: {
        schemas: {
          Node: {
            type: 'object',
            properties: {
              child: { $ref: '#/components/schemas/Node' },
            },
          },
        },
      },
    };

    const resolved = resolveSchema({ $ref: '#/components/schemas/Node' }, document);

    expect(resolved).toMatchObject({
      type: 'object',
      properties: {
        child: { $ref: '#/components/schemas/Node' },
      },
    });
  });

  it('leaves external refs unresolved', () => {
    const schema = { $ref: 'https://example.com/pet.json' };
    expect(resolveSchema(schema, petStoreDocument)).toEqual(schema);
  });

  it('returns the original schema when document is missing', () => {
    const schema = { $ref: '#/components/schemas/Pet' };
    expect(resolveSchema(schema, null)).toEqual(schema);
  });
});
