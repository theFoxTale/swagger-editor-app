import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EndpointRequestBody } from '@/components/Viewer/EndpointRequestBody';
import type { RequestBody } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      requestBodyTitle: 'Request body',
      requestBodyEmpty: 'This endpoint has no request body.',
      requestBodyRequired: 'Required',
      requestBodyOptional: 'Optional',
      requestBodyContentType: 'Content type',
      requestBodySchema: 'Schema',
      requestBodyExample: 'Example',
      requestBodyNoExample: 'No example provided for this content type.',
      schemaEmpty: 'No schema defined.',
      schemaRequired: 'required',
      schemaOptional: 'optional',
      schemaEnum: 'Enum',
      schemaItems: 'Items',
      schemaAllOf: 'allOf',
      schemaAnyOf: 'anyOf',
      schemaOneOf: 'oneOf',
    },
  }),
}));

const createRequestBody = (overrides: Partial<RequestBody> = {}): RequestBody => ({
  required: true,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Pet' },
      example: { id: '1', name: 'Rex' },
    },
  },
  ...overrides,
});

describe('EndpointRequestBody', () => {
  it('shows empty message when request body is missing', () => {
    render(<EndpointRequestBody />);

    expect(screen.getByText('This endpoint has no request body.')).toBeInTheDocument();
  });

  it('renders content type, schema, and example', () => {
    render(
      <EndpointRequestBody
        requestBody={createRequestBody()}
        document={{
          components: {
            schemas: {
              Pet: {
                type: 'object',
                required: ['id', 'name'],
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        }}
      />
    );

    expect(screen.getByText('Request body')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'application/json' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText('Pet')).toBeInTheDocument();
    expect(screen.getByText('object')).toBeInTheDocument();
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText(/"name": "Rex"/)).toBeInTheDocument();
  });

  it('switches between content types', async () => {
    const user = userEvent.setup();

    render(
      <EndpointRequestBody
        requestBody={{
          required: false,
          description: 'Pet payload',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: { name: 'json' },
            },
            'application/xml': {
              schema: { type: 'string' },
              example: '<pet />',
            },
          },
        }}
      />
    );

    expect(screen.getByText('Optional')).toBeInTheDocument();
    expect(screen.getByText('Pet payload')).toBeInTheDocument();
    expect(screen.getByText(/"name": "json"/)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'application/xml' }));

    expect(screen.getByRole('tab', { name: 'application/xml' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText('<pet />')).toBeInTheDocument();
  });

  it('shows a fallback when no example is provided', () => {
    render(
      <EndpointRequestBody
        requestBody={{
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
            },
          },
        }}
      />
    );

    expect(screen.getByText('No example provided for this content type.')).toBeInTheDocument();
  });
});
