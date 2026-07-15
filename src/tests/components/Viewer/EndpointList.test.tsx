import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EndpointList } from '@/components/Viewer/EndpointList';
import type { Operation, TagGroup } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      endpointsLabel: 'API endpoints',
      emptyEndpoints: 'No endpoints found in this schema.',
      requiresAuth: 'Requires authentication',
      tagGroupLabel: '{name} tag group',
      operationsCount: '{count} operations',
      expandEndpoint: 'Show endpoint details for {method} {path}',
      collapseEndpoint: 'Hide endpoint details for {method} {path}',
      tryItOut: 'Try it out',
      cancelTryItOut: 'Cancel',
      tryItOutPanel: 'Try it out request form',
      tryItOutPlaceholder: 'Parameter and body inputs will appear here.',
      tryItOutParametersTitle: 'Parameters',
      tryItOutParametersEmpty: 'This endpoint has no parameters to fill.',
      tryItOutRequired: 'required',
      tryItOutUnset: '—',
      tryItOutBooleanTrue: 'true',
      tryItOutBooleanFalse: 'false',
      tryItOutArrayHint: 'Enter a JSON array, e.g. ["a", "b"]',
      tryItOutObjectHint: 'Enter a JSON object, e.g. {"key": "value"}',
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
      requestBodyTitle: 'Request body',
      requestBodyEmpty: 'This endpoint has no request body.',
      requestBodyRequired: 'Required',
      requestBodyOptional: 'Optional',
      requestBodyContentType: 'Content type',
      requestBodySchema: 'Schema',
      requestBodyExample: 'Example',
      requestBodyNoExample: 'No example provided for this content type.',
      responsesTitle: 'Responses',
      responsesEmpty: 'This endpoint has no responses.',
      responseNoDescription: 'No description',
      responseContentType: 'Response content type',
      responseSchema: 'Schema',
      responseExample: 'Example',
      responseNoExample: 'No example provided for this content type.',
      responseNoSchema: 'No schema provided for this content type.',
      responseNoContent: 'No response content defined.',
      responseHeaders: 'Headers',
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

const createOperation = (overrides: Partial<Operation> = {}): Operation => ({
  id: 'listPets',
  method: 'get',
  path: '/pets',
  summary: 'List all pets',
  tags: ['pet'],
  parameters: [],
  responses: [],
  ...overrides,
});

const petGroup: TagGroup = {
  name: 'pet',
  description: 'Everything about your Pets',
  operations: [
    createOperation(),
    createOperation({ id: 'createPet', method: 'post', summary: 'Create a pet' }),
  ],
};

const storeGroup: TagGroup = {
  name: 'store',
  description: 'Access to Petstore orders',
  operations: [
    createOperation({
      id: 'getOrder',
      method: 'get',
      path: '/store/order/{orderId}',
      summary: 'Find order',
      tags: ['store'],
    }),
  ],
};

describe('EndpointList', () => {
  it('shows an empty message when there are no tag groups', () => {
    render(<EndpointList tagGroups={[]} />);

    expect(screen.getByText('No endpoints found in this schema.')).toBeInTheDocument();
  });

  it('renders tag groups from extractEndpoints data', () => {
    render(<EndpointList tagGroups={[petGroup, storeGroup]} />);

    expect(screen.getByLabelText('API endpoints')).toBeInTheDocument();
    expect(screen.getByText('pet')).toBeInTheDocument();
    expect(screen.getByText('store')).toBeInTheDocument();
    expect(screen.getByText('Everything about your Pets')).toBeInTheDocument();
  });

  it('opens the first tag group by default', () => {
    render(<EndpointList tagGroups={[petGroup, storeGroup]} />);

    expect(screen.getByRole('button', { name: 'pet tag group' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: 'store tag group' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(
      screen.getByRole('button', { name: 'Show endpoint details for GET /pets' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Show endpoint details for GET /store/order/{orderId}',
      })
    ).not.toBeInTheDocument();
  });

  it('expands only one endpoint at a time', async () => {
    const user = userEvent.setup();

    render(<EndpointList tagGroups={[petGroup]} />);

    await user.click(screen.getByRole('button', { name: 'Show endpoint details for GET /pets' }));
    expect(
      screen.getByRole('button', { name: 'Hide endpoint details for GET /pets' })
    ).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: 'Show endpoint details for POST /pets' }));
    expect(
      screen.getByRole('button', { name: 'Show endpoint details for GET /pets' })
    ).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getByRole('button', { name: 'Hide endpoint details for POST /pets' })
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows parameters when an endpoint is expanded', async () => {
    const user = userEvent.setup();
    const groupWithParams: TagGroup = {
      ...petGroup,
      operations: [
        createOperation({
          id: 'getPet',
          path: '/pets/{petId}',
          summary: 'Get a pet by ID',
          parameters: [
            {
              name: 'petId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Pet identifier',
            },
          ],
        }),
      ],
    };

    render(<EndpointList tagGroups={[groupWithParams]} />);

    await user.click(
      screen.getByRole('button', {
        name: 'Show endpoint details for GET /pets/{petId}',
      })
    );

    expect(screen.getByRole('button', { name: 'Try it out' })).toBeInTheDocument();
    expect(screen.getByText('Parameters')).toBeInTheDocument();
    expect(screen.getByText('Path parameters')).toBeInTheDocument();
    expect(screen.getByText('petId')).toBeInTheDocument();
    expect(screen.getByText('Pet identifier')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try it out' }));
    const tryItOutForm = screen.getByRole('region', { name: 'Try it out request form' });
    expect(tryItOutForm).toBeInTheDocument();
    expect(within(tryItOutForm).getByRole('textbox', { name: /petId/ })).toBeInTheDocument();
  });

  it('shows request body details when an endpoint has a body', async () => {
    const user = userEvent.setup();
    const groupWithBody: TagGroup = {
      ...petGroup,
      operations: [
        createOperation({
          id: 'createPet',
          method: 'post',
          summary: 'Create a pet',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pet' },
                example: { id: '1', name: 'Rex' },
              },
            },
          },
        }),
      ],
    };

    render(<EndpointList tagGroups={[groupWithBody]} />);

    await user.click(screen.getByRole('button', { name: 'Show endpoint details for POST /pets' }));

    expect(screen.getByText('Request body')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'application/json' })).toBeInTheDocument();
    expect(screen.getByText(/"name": "Rex"/)).toBeInTheDocument();
  });

  it('shows responses when an endpoint is expanded', async () => {
    const user = userEvent.setup();
    const groupWithResponses: TagGroup = {
      ...petGroup,
      operations: [
        createOperation({
          id: 'listPets',
          responses: [
            {
              statusCode: '200',
              description: 'A list of pets',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { type: 'string' } },
                  example: ['a'],
                },
              },
            },
          ],
        }),
      ],
    };

    render(<EndpointList tagGroups={[groupWithResponses]} />);

    await user.click(screen.getByRole('button', { name: 'Show endpoint details for GET /pets' }));

    expect(screen.getByText('Responses')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('A list of pets')).toBeInTheDocument();
  });
});
