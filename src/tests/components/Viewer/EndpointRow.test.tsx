import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EndpointRow, operationRequiresAuth } from '@/components/Viewer/EndpointRow/EndpointRow';
import type { Operation } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      requiresAuth: 'Requires authentication',
      expandEndpoint: 'Show endpoint details for {method} {path}',
      collapseEndpoint: 'Hide endpoint details for {method} {path}',
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

describe('operationRequiresAuth', () => {
  it('returns false when security is missing or empty', () => {
    expect(operationRequiresAuth(createOperation())).toBe(false);
    expect(operationRequiresAuth(createOperation({ security: [] }))).toBe(false);
    expect(operationRequiresAuth(createOperation({ security: [{}] }))).toBe(false);
  });

  it('returns true when a security scheme is required', () => {
    expect(
      operationRequiresAuth(createOperation({ security: [{ petstore_auth: ['write:pets'] }] }))
    ).toBe(true);
  });
});

describe('EndpointRow', () => {
  it('renders method, path, and summary', () => {
    render(<EndpointRow operation={createOperation()} />);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/pets')).toBeInTheDocument();
    expect(screen.getByText('List all pets')).toBeInTheDocument();
  });

  it('shows a lock icon when auth is required', () => {
    render(<EndpointRow operation={createOperation({ security: [{ ApiKeyAuth: [] }] })} />);

    expect(screen.getByTitle('Requires authentication')).toBeInTheDocument();
  });

  it('does not show a lock icon without security', () => {
    render(<EndpointRow operation={createOperation()} />);

    expect(screen.queryByTitle('Requires authentication')).not.toBeInTheDocument();
  });

  it('calls onToggle when the row is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<EndpointRow operation={createOperation()} onToggle={onToggle} />);

    await user.click(screen.getByRole('button', { name: 'Show endpoint details for GET /pets' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('exposes aria-expanded and renders children when expanded', () => {
    const { rerender } = render(
      <EndpointRow operation={createOperation()} expanded={false}>
        <p>Details panel</p>
      </EndpointRow>
    );

    expect(
      screen.getByRole('button', { name: 'Show endpoint details for GET /pets' })
    ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Details panel')).not.toBeInTheDocument();

    rerender(
      <EndpointRow operation={createOperation()} expanded>
        <p>Details panel</p>
      </EndpointRow>
    );

    const toggle = screen.getByRole('button', {
      name: 'Hide endpoint details for GET /pets',
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-controls');
    expect(screen.getByText('Details panel')).toBeInTheDocument();
  });

  it('collapses on Escape when expanded', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<EndpointRow operation={createOperation()} expanded onToggle={onToggle} />);

    const toggle = screen.getByRole('button', {
      name: 'Hide endpoint details for GET /pets',
    });
    toggle.focus();
    await user.keyboard('{Escape}');

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
