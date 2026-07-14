import { render, screen } from '@testing-library/react';
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

    expect(screen.getByText('Parameters')).toBeInTheDocument();
    expect(screen.getByText('Path parameters')).toBeInTheDocument();
    expect(screen.getByText('petId')).toBeInTheDocument();
    expect(screen.getByText('Pet identifier')).toBeInTheDocument();
  });
});
