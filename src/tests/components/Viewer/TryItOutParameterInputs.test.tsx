import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  createInitialParameterValues,
  getParameterInputKind,
  TryItOutParameterInputs,
  type ParameterValues,
} from '@/components/Viewer/TryItOutParameterInputs';
import type { OperationParameter } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      tryItOutParametersTitle: 'Parameters',
      tryItOutParametersEmpty: 'This endpoint has no parameters to fill.',
      tryItOutRequired: 'required',
      tryItOutUnset: '—',
      tryItOutBooleanTrue: 'true',
      tryItOutBooleanFalse: 'false',
      tryItOutArrayHint: 'Enter a JSON array, e.g. ["a", "b"]',
      tryItOutObjectHint: 'Enter a JSON object, e.g. {"key": "value"}',
      parametersPath: 'Path parameters',
      parametersQuery: 'Query parameters',
      parametersHeader: 'Header parameters',
      parametersCookie: 'Cookie parameters',
    },
  }),
}));

const createParameter = (overrides: Partial<OperationParameter> = {}): OperationParameter => ({
  name: 'petId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  ...overrides,
});

describe('getParameterInputKind', () => {
  it('maps schema types to input kinds', () => {
    expect(getParameterInputKind({ type: 'boolean' })).toBe('boolean');
    expect(getParameterInputKind({ type: 'integer' })).toBe('number');
    expect(getParameterInputKind({ type: 'number' })).toBe('number');
    expect(getParameterInputKind({ type: 'string', enum: ['available', 'pending'] })).toBe('enum');
    expect(getParameterInputKind({ type: 'array', items: { type: 'string' } })).toBe('array');
    expect(getParameterInputKind({ type: 'object' })).toBe('object');
    expect(getParameterInputKind({ type: 'string' })).toBe('string');
  });

  it('resolves $ref schemas when a document is provided', () => {
    const document = {
      components: {
        schemas: {
          Status: { type: 'string', enum: ['available', 'sold'] },
        },
      },
    };

    expect(getParameterInputKind({ $ref: '#/components/schemas/Status' }, document)).toBe('enum');
  });
});

describe('createInitialParameterValues', () => {
  it('prefills from example and default values', () => {
    const values = createInitialParameterValues([
      createParameter({ name: 'petId', example: '42' }),
      createParameter({
        name: 'limit',
        in: 'query',
        required: false,
        schema: { type: 'integer', default: 20 },
        example: undefined,
      }),
    ]);

    expect(values['path:petId']).toBe('42');
    expect(values['query:limit']).toBe('20');
  });
});

describe('TryItOutParameterInputs', () => {
  it('shows empty state when there are no parameters', () => {
    render(<TryItOutParameterInputs parameters={[]} />);

    expect(screen.getByText('This endpoint has no parameters to fill.')).toBeInTheDocument();
  });

  it('renders string, number, boolean, and enum controls', async () => {
    const user = userEvent.setup();

    render(
      <TryItOutParameterInputs
        parameters={[
          createParameter({ name: 'petId', description: 'Pet identifier' }),
          createParameter({
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer' },
          }),
          createParameter({
            name: 'verbose',
            in: 'query',
            required: false,
            schema: { type: 'boolean' },
          }),
          createParameter({
            name: 'status',
            in: 'query',
            required: true,
            schema: { type: 'string', enum: ['available', 'pending'] },
            example: 'available',
          }),
        ]}
      />
    );

    expect(screen.getByLabelText(/petId/)).toHaveAttribute('type', 'text');
    expect(screen.getByText('Pet identifier')).toBeInTheDocument();

    const limit = screen.getByLabelText(/limit/);
    expect(limit).toHaveAttribute('type', 'number');
    await user.clear(limit);
    await user.type(limit, '10');
    expect(limit).toHaveValue(10);

    const verbose = screen.getByLabelText(/verbose/);
    expect(verbose.tagName).toBe('SELECT');
    await user.selectOptions(verbose, 'true');
    expect(verbose).toHaveValue('true');

    const status = screen.getByLabelText(/status/);
    expect(status).toHaveValue('available');
    await user.selectOptions(status, 'pending');
    expect(status).toHaveValue('pending');
  });

  it('renders array and object textareas with hints', () => {
    render(
      <TryItOutParameterInputs
        parameters={[
          createParameter({
            name: 'tags',
            in: 'query',
            required: false,
            schema: { type: 'array', items: { type: 'string' } },
          }),
          createParameter({
            name: 'X-Meta',
            in: 'header',
            required: false,
            schema: { type: 'object' },
          }),
        ]}
      />
    );

    expect(screen.getByLabelText(/tags/).tagName).toBe('TEXTAREA');
    expect(screen.getByText('Enter a JSON array, e.g. ["a", "b"]')).toBeInTheDocument();
    expect(screen.getByLabelText(/X-Meta/).tagName).toBe('TEXTAREA');
    expect(screen.getByText('Enter a JSON object, e.g. {"key": "value"}')).toBeInTheDocument();
  });

  it('supports controlled values', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [values, setValues] = useState<ParameterValues>({ 'path:petId': '1' });

      return (
        <TryItOutParameterInputs
          parameters={[createParameter({ name: 'petId', example: '1' })]}
          values={values}
          onValuesChange={setValues}
        />
      );
    };

    render(<Controlled />);

    const input = screen.getByRole('textbox', { name: /petId/ });
    await user.clear(input);
    await user.type(input, '99');

    expect(input).toHaveValue('99');
  });
});
