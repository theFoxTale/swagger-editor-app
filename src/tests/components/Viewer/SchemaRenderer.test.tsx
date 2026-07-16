import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SchemaRenderer } from '@/components/Viewer/SchemaRenderer';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
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

describe('SchemaRenderer', () => {
  it('shows empty message when schema is missing', () => {
    render(<SchemaRenderer />);

    expect(screen.getByText('No schema defined.')).toBeInTheDocument();
  });

  it('renders object properties with required markers', () => {
    render(
      <SchemaRenderer
        schema={{
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: { type: 'string', description: 'Pet id' },
            name: { type: 'string' },
            tag: { type: 'string' },
            status: {
              type: 'string',
              enum: ['available', 'pending', 'sold'],
            },
          },
        }}
      />
    );

    expect(screen.getByText('object')).toBeInTheDocument();
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('Pet id')).toBeInTheDocument();
    expect(screen.getAllByText('required')).toHaveLength(2);
    expect(screen.getAllByText('optional')).toHaveLength(2);
    expect(screen.getByText(/Enum/)).toBeInTheDocument();
    expect(screen.getByText('available')).toBeInTheDocument();
    expect(screen.getByText('sold')).toBeInTheDocument();
  });

  it('renders array items recursively', () => {
    render(
      <SchemaRenderer
        schema={{
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        }}
      />
    );

    expect(screen.getByText('array<object>')).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
  });
});
