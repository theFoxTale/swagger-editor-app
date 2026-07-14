import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { getTagAccentClass, TagGroup } from '@/components/Viewer/TagGroup/TagGroup';
import type { Operation, TagGroup as TagGroupData } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      requiresAuth: 'Requires authentication',
      tagGroupLabel: '{name} tag group',
      operationsCount: '{count} operations',
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

const createGroup = (overrides: Partial<TagGroupData> = {}): TagGroupData => ({
  name: 'pet',
  description: 'Everything about your Pets',
  operations: [
    createOperation(),
    createOperation({
      id: 'createPet',
      method: 'post',
      summary: 'Create a pet',
    }),
  ],
  ...overrides,
});

describe('getTagAccentClass', () => {
  it('returns a stable accent class for the same tag name', () => {
    expect(getTagAccentClass('pet')).toBe(getTagAccentClass('pet'));
  });
});

describe('TagGroup', () => {
  it('renders the tag name, description, and operation count', () => {
    render(<TagGroup group={createGroup()} defaultOpen />);

    expect(screen.getByText('pet')).toBeInTheDocument();
    expect(screen.getByText('Everything about your Pets')).toBeInTheDocument();
    expect(screen.getByLabelText('2 operations')).toBeInTheDocument();
  });

  it('starts collapsed by default and can expand to show endpoints', async () => {
    const user = userEvent.setup();

    render(<TagGroup group={createGroup()} />);

    expect(screen.queryByText('/pets')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'pet tag group' }));

    expect(screen.getAllByText('/pets')).toHaveLength(2);
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('supports controlled open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <TagGroup group={createGroup()} open={false} onOpenChange={onOpenChange} />
    );

    expect(screen.queryByText('/pets')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'pet tag group' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(<TagGroup group={createGroup()} open onOpenChange={onOpenChange} />);
    expect(screen.getAllByText('/pets').length).toBeGreaterThan(0);
  });

  it('forwards endpoint toggle callbacks', async () => {
    const user = userEvent.setup();
    const onToggleOperation = vi.fn();

    render(<TagGroup group={createGroup()} defaultOpen onToggleOperation={onToggleOperation} />);

    await user.click(screen.getByRole('button', { name: 'Show endpoint details for GET /pets' }));

    expect(onToggleOperation).toHaveBeenCalledWith('listPets');
  });

  it('renders details for the expanded operation', () => {
    render(
      <TagGroup
        group={createGroup()}
        defaultOpen
        expandedOperationId="listPets"
        renderDetails={(operation) => <p>Details for {operation.id}</p>}
      />
    );

    expect(screen.getByText('Details for listPets')).toBeInTheDocument();
  });

  it('collapses on Escape when open', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<TagGroup group={createGroup()} open onOpenChange={onOpenChange} />);

    screen.getByRole('button', { name: 'pet tag group' }).focus();
    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
