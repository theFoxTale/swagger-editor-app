import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useTryItOutState } from '@/hooks/useTryItOutState';
import type { Operation } from '@/lib/openapi';

const operation: Operation = {
  id: 'createPet',
  method: 'post',
  path: '/pets',
  summary: 'Create a pet',
  tags: ['pet'],
  parameters: [
    {
      name: 'verbose',
      in: 'query',
      required: false,
      schema: { type: 'boolean' },
    },
    {
      name: 'petId',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      example: '42',
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        example: { id: 1, name: 'Rex' },
      },
      'application/xml': {
        example: '<pet />',
      },
    },
  },
  responses: [],
};

describe('useTryItOutState', () => {
  it('initializes parameters, headers, and body from the operation', () => {
    const { result } = renderHook(() => useTryItOutState({ operation }));

    expect(result.current.parameters['path:petId']).toBe('42');
    expect(result.current.parameters['query:verbose']).toBe('');
    expect(result.current.headers.map((header) => header.name)).toEqual([
      'Accept',
      'Authorization',
    ]);
    expect(result.current.contentType).toBe('application/json');
    expect(result.current.body).toContain('"name": "Rex"');
    expect(result.current.isBodyValid).toBe(true);
  });

  it('updates parameters, headers, and body', () => {
    const { result } = renderHook(() => useTryItOutState({ operation }));

    act(() => {
      result.current.setParameters({ ...result.current.parameters, 'query:verbose': 'true' });
      result.current.setHeaders([
        ...result.current.headers,
        { id: 'custom-1', name: 'X-Trace', value: '1' },
      ]);
      result.current.setBody('{broken');
    });

    expect(result.current.parameters['query:verbose']).toBe('true');
    expect(result.current.headers).toHaveLength(3);
    expect(result.current.isBodyValid).toBe(false);
  });

  it('switches content type and reloads the body example', () => {
    const { result } = renderHook(() => useTryItOutState({ operation }));

    act(() => {
      result.current.setContentType('application/xml');
    });

    expect(result.current.contentType).toBe('application/xml');
    expect(result.current.body).toBe('<pet />');
  });

  it('clears state back to defaults', () => {
    const { result } = renderHook(() => useTryItOutState({ operation }));

    act(() => {
      result.current.setParameters({ ...result.current.parameters, 'query:verbose': 'true' });
      result.current.setBody('{broken');
      result.current.setHeaders([
        result.current.headers[0]!,
        { ...result.current.headers[1]!, value: 'Bearer secret' },
      ]);
    });

    act(() => {
      result.current.clear();
    });

    expect(result.current.parameters['query:verbose']).toBe('');
    expect(result.current.parameters['path:petId']).toBe('42');
    expect(result.current.headers[1]?.value).toBe('');
    expect(result.current.contentType).toBe('application/json');
    expect(result.current.body).toContain('"name": "Rex"');
    expect(result.current.isBodyValid).toBe(true);
  });

  it('builds a request snapshot for later execution', () => {
    const { result } = renderHook(() => useTryItOutState({ operation }));

    act(() => {
      result.current.setParameters({ ...result.current.parameters, 'query:verbose': 'true' });
      result.current.setHeaders([
        result.current.headers[0]!,
        { ...result.current.headers[1]!, value: 'Bearer secret' },
      ]);
    });

    expect(result.current.getSnapshot()).toEqual({
      parameters: {
        'path:petId': '42',
        'query:verbose': 'true',
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer secret',
      },
      contentType: 'application/json',
      body: result.current.body,
    });
  });
});
