import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EndpointList } from '@/components/Viewer/EndpointList/EndpointList';
import type { Operation, TagGroup } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      endpointsLabel: 'API endpoints',
      emptyEndpoints: 'No endpoints found in this schema.',
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
    expect(screen.getByRole('button', { name: 'GET /pets' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'GET /store/order/{orderId}' })
    ).not.toBeInTheDocument();
  });

  it('expands only one endpoint at a time', async () => {
    const user = userEvent.setup();

    render(<EndpointList tagGroups={[petGroup]} />);

    await user.click(screen.getByRole('button', { name: 'GET /pets' }));
    expect(screen.getByRole('button', { name: 'GET /pets' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    await user.click(screen.getByRole('button', { name: 'POST /pets' }));
    expect(screen.getByRole('button', { name: 'GET /pets' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByRole('button', { name: 'POST /pets' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});
