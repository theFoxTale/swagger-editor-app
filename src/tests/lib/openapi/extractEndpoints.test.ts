import { describe, expect, it } from 'vitest';

import {
  DEFAULT_OPERATION_TAG,
  DEFAULT_SCHEMA,
  extractEndpoints,
  getServerUrl,
  groupOperationsByTag,
  NEW_TAB_SCHEMA,
  validateSchema,
} from '@/lib/openapi';

describe('extractEndpoints', () => {
  it('returns null for null spec', () => {
    expect(extractEndpoints(null)).toBeNull();
  });

  it('returns null when info is missing', () => {
    expect(extractEndpoints({ openapi: '3.0.3', paths: {} })).toBeNull();
  });

  it('extracts operations from the default Pet Store schema', () => {
    const parsed = validateSchema(DEFAULT_SCHEMA).parsed;
    const result = extractEndpoints(parsed);

    expect(result).not.toBeNull();
    expect(result?.info).toEqual({
      title: 'Pet Store API',
      version: '1.0.0',
      description: 'A sample API for managing pets',
    });
    expect(result?.servers).toEqual([
      { url: 'https://api.petstore.example.com/v1', description: undefined },
    ]);
    expect(result?.operations).toHaveLength(5);
    expect(result?.document).toBe(parsed);
    expect(
      result?.operations.map((operation) => `${operation.method.toUpperCase()} ${operation.path}`)
    ).toEqual([
      'GET /pets',
      'POST /pets',
      'GET /pets/{petId}',
      'PUT /pets/{petId}',
      'DELETE /pets/{petId}',
    ]);
  });

  it('groups operations by tag', () => {
    const parsed = validateSchema(DEFAULT_SCHEMA).parsed;
    const result = extractEndpoints(parsed);

    expect(result?.tagGroups).toHaveLength(1);
    expect(result?.tagGroups[0]).toMatchObject({
      name: 'pet',
      operations: expect.arrayContaining([
        expect.objectContaining({ method: 'get', path: '/pets', summary: 'List all pets' }),
        expect.objectContaining({ method: 'post', path: '/pets', summary: 'Create a pet' }),
      ]),
    });
  });

  it('extracts path parameters and request body', () => {
    const parsed = validateSchema(DEFAULT_SCHEMA).parsed;
    const result = extractEndpoints(parsed);
    const getPet = result?.operations.find((operation) => operation.operationId === 'getPet');

    expect(getPet?.parameters).toEqual([
      {
        name: 'petId',
        in: 'path',
        required: true,
        description: undefined,
        schema: { type: 'string' },
        example: undefined,
        deprecated: undefined,
      },
    ]);

    const createPet = result?.operations.find((operation) => operation.operationId === 'createPet');
    expect(createPet?.requestBody).toMatchObject({
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Pet' },
        },
      },
    });
  });

  it('extracts responses with content and status codes', () => {
    const parsed = validateSchema(DEFAULT_SCHEMA).parsed;
    const result = extractEndpoints(parsed);
    const listPets = result?.operations.find((operation) => operation.operationId === 'listPets');

    expect(listPets?.responses).toEqual([
      {
        statusCode: '200',
        description: 'A list of pets',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/Pet' },
            },
            example: undefined,
            examples: undefined,
          },
        },
        headers: undefined,
      },
    ]);
  });

  it('uses operationId as stable operation id', () => {
    const parsed = validateSchema(DEFAULT_SCHEMA).parsed;
    const result = extractEndpoints(parsed);

    expect(result?.operations.every((operation) => operation.id === operation.operationId)).toBe(
      true
    );
  });

  it('returns empty operations for a schema with no paths', () => {
    const parsed = validateSchema(NEW_TAB_SCHEMA).parsed;
    const result = extractEndpoints(parsed);

    expect(result).toMatchObject({
      info: { title: 'New API', version: '1.0.0' },
      servers: [],
      operations: [],
      tagGroups: [],
    });
  });

  it('assigns the default tag when an operation has no tags', () => {
    const result = extractEndpoints({
      openapi: '3.0.3',
      info: { title: 'Demo', version: '1.0.0' },
      paths: {
        '/health': {
          get: {
            summary: 'Health check',
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    });

    expect(result?.operations[0]?.tags).toEqual([DEFAULT_OPERATION_TAG]);
    expect(result?.tagGroups).toEqual([
      expect.objectContaining({
        name: DEFAULT_OPERATION_TAG,
        operations: [expect.objectContaining({ method: 'get', path: '/health' })],
      }),
    ]);
  });

  it('merges path-level parameters with operation parameters', () => {
    const result = extractEndpoints({
      openapi: '3.0.3',
      info: { title: 'Demo', version: '1.0.0' },
      paths: {
        '/items/{itemId}': {
          parameters: [
            { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'locale', in: 'query', schema: { type: 'string' } },
          ],
          get: {
            parameters: [
              { name: 'locale', in: 'query', required: true, schema: { type: 'string' } },
            ],
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    });

    expect(result?.operations[0]?.parameters).toEqual([
      {
        name: 'itemId',
        in: 'path',
        required: true,
        description: undefined,
        schema: { type: 'string' },
        example: undefined,
        deprecated: undefined,
      },
      {
        name: 'locale',
        in: 'query',
        required: true,
        description: undefined,
        schema: { type: 'string' },
        example: undefined,
        deprecated: undefined,
      },
    ]);
  });

  it('builds a method:path id when operationId is missing', () => {
    const result = extractEndpoints({
      openapi: '3.0.3',
      info: { title: 'Demo', version: '1.0.0' },
      paths: {
        '/ping': {
          get: {
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    });

    expect(result?.operations[0]?.id).toBe('get:/ping');
  });
});

describe('groupOperationsByTag', () => {
  it('preserves tag definition order and descriptions', () => {
    const operations = [
      {
        id: 'a',
        method: 'get' as const,
        path: '/a',
        tags: ['store'],
        parameters: [],
        responses: [],
      },
      {
        id: 'b',
        method: 'get' as const,
        path: '/b',
        tags: ['pet'],
        parameters: [],
        responses: [],
      },
    ];

    const groups = groupOperationsByTag(operations, [
      { name: 'pet', description: 'Everything about pets' },
      { name: 'store', description: 'Access to orders' },
    ]);

    expect(groups.map((group) => group.name)).toEqual(['pet', 'store']);
    expect(groups[0]?.description).toBe('Everything about pets');
  });
});

describe('getServerUrl', () => {
  it('returns the first server URL from the Pet Store schema', () => {
    const parsed = validateSchema(DEFAULT_SCHEMA).parsed;
    const extracted = extractEndpoints(parsed);

    expect(getServerUrl(extracted)).toBe('https://api.petstore.example.com/v1');
    expect(getServerUrl(extracted?.servers)).toBe('https://api.petstore.example.com/v1');
    expect(getServerUrl(parsed)).toBe('https://api.petstore.example.com/v1');
  });

  it('returns null when servers are missing or empty', () => {
    expect(getServerUrl(null)).toBeNull();
    expect(getServerUrl(undefined)).toBeNull();
    expect(getServerUrl([])).toBeNull();
    expect(getServerUrl({ openapi: '3.0.3', info: { title: 'X', version: '1' } })).toBeNull();
  });

  it('skips invalid server entries and uses the first valid URL', () => {
    expect(
      getServerUrl([
        { url: '   ', description: 'blank' },
        { url: 'https://api.example.com', description: 'primary' },
      ])
    ).toBe('https://api.example.com');
  });
});
