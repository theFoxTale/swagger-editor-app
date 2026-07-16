import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  EndpointParameters,
  getSchemaTypeLabel,
  groupParametersByLocation,
} from '@/components/Viewer/EndpointParameters';
import type { OperationParameter } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      parametersTitle: 'Parameters',
      parametersEmpty: 'This endpoint has no parameters.',
      parametersPath: 'Path parameters',
      parametersQuery: 'Query parameters',
      parametersHeader: 'Header parameters',
      parametersCookie: 'Cookie parameters',
      parameterName: 'Name',
      parameterType: 'Type',
      parameterRequired: 'Required',
      parameterRequiredYes: 'Yes',
      parameterRequiredNo: 'No',
      parameterDescription: 'Description',
      parameterNoDescription: '—',
      parameterExample: 'Example',
      deprecated: 'Deprecated',
    },
  }),
}));

const createParameter = (overrides: Partial<OperationParameter>): OperationParameter => ({
  name: 'petId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  ...overrides,
});

describe('getSchemaTypeLabel', () => {
  it('formats primitive, array, and $ref schemas', () => {
    expect(getSchemaTypeLabel()).toBe('—');
    expect(getSchemaTypeLabel({ type: 'string', format: 'uuid' })).toBe('string (uuid)');
    expect(getSchemaTypeLabel({ type: 'array', items: { type: 'integer' } })).toBe(
      'array<integer>'
    );
    expect(getSchemaTypeLabel({ $ref: '#/components/schemas/Pet' })).toBe('Pet');
  });
});

describe('groupParametersByLocation', () => {
  it('groups parameters by OpenAPI location', () => {
    const grouped = groupParametersByLocation([
      createParameter({ name: 'petId', in: 'path' }),
      createParameter({ name: 'limit', in: 'query', required: false }),
      createParameter({ name: 'X-Request-Id', in: 'header', required: false }),
      createParameter({ name: 'session', in: 'cookie', required: false }),
    ]);

    expect(grouped.path).toHaveLength(1);
    expect(grouped.query).toHaveLength(1);
    expect(grouped.header).toHaveLength(1);
    expect(grouped.cookie).toHaveLength(1);
  });
});

describe('EndpointParameters', () => {
  it('shows empty message when there are no parameters', () => {
    render(<EndpointParameters parameters={[]} />);

    expect(screen.getByText('This endpoint has no parameters.')).toBeInTheDocument();
  });

  it('renders parameter groups for each location type', () => {
    render(
      <EndpointParameters
        parameters={[
          createParameter({
            name: 'petId',
            in: 'path',
            description: 'Pet id',
            example: '123',
          }),
          createParameter({
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', format: 'int32' },
          }),
          createParameter({
            name: 'Accept',
            in: 'header',
            required: false,
            deprecated: true,
          }),
          createParameter({
            name: 'sid',
            in: 'cookie',
            required: false,
          }),
        ]}
      />
    );

    expect(screen.getByText('Parameters')).toBeInTheDocument();
    expect(screen.getByText('Path parameters')).toBeInTheDocument();
    expect(screen.getByText('Query parameters')).toBeInTheDocument();
    expect(screen.getByText('Header parameters')).toBeInTheDocument();
    expect(screen.getByText('Cookie parameters')).toBeInTheDocument();

    expect(screen.getByText('petId')).toBeInTheDocument();
    expect(screen.getByText('Pet id')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('integer (int32)')).toBeInTheDocument();
    expect(screen.getByText('Deprecated')).toBeInTheDocument();
    expect(screen.getAllByText('Yes')).toHaveLength(1);
    expect(screen.getAllByText('No').length).toBeGreaterThan(0);
  });
});
