import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ViewerEmptyState } from '@/components/Viewer/ViewerEmptyState';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      emptySchemaTitle: 'No schema to preview',
      emptySchema: 'Paste or type a valid OpenAPI schema in the editor.',
      invalidSchemaTitle: 'Schema is invalid',
      invalidSchema: 'Fix the errors in the editor to update the viewer.',
      invalidSchemaHint: 'Validation errors are shown under the editor panel.',
    },
  }),
}));

describe('ViewerEmptyState', () => {
  it('renders the empty schema state', () => {
    render(<ViewerEmptyState state="empty" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('No schema to preview')).toBeInTheDocument();
    expect(
      screen.getByText('Paste or type a valid OpenAPI schema in the editor.')
    ).toBeInTheDocument();
  });

  it('renders invalid schema state with validation errors', () => {
    render(
      <ViewerEmptyState
        state="invalid"
        validationErrors={['Missing required field: info', 'Field "paths" must be an object']}
      />
    );

    expect(screen.getByText('Schema is invalid')).toBeInTheDocument();
    expect(
      screen.getByText('Fix the errors in the editor to update the viewer.')
    ).toBeInTheDocument();
    expect(screen.getByText('Missing required field: info')).toBeInTheDocument();
    expect(screen.getByText('Field "paths" must be an object')).toBeInTheDocument();
  });

  it('renders a hint when invalid and there are no error details', () => {
    render(<ViewerEmptyState state="invalid" />);

    expect(
      screen.getByText('Validation errors are shown under the editor panel.')
    ).toBeInTheDocument();
  });
});
