import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  createDefaultHeaders,
  headersToRecord,
  TryItOutHeadersEditor,
  type HeaderEntry,
} from '@/components/Viewer/TryItOutHeadersEditor';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      tryItOutHeadersTitle: 'Headers',
      tryItOutHeaderName: 'Name',
      tryItOutHeaderValue: 'Value',
      tryItOutAddHeader: 'Add header',
      tryItOutRemoveHeader: 'Remove',
      tryItOutCustomHeader: 'Custom header',
      tryItOutAcceptPlaceholder: 'application/json',
      tryItOutAuthorizationPlaceholder: 'Bearer <token>',
    },
  }),
}));

describe('headersToRecord', () => {
  it('skips empty names and values', () => {
    expect(
      headersToRecord([
        { id: '1', name: 'Accept', value: 'application/json' },
        { id: '2', name: 'Authorization', value: '   ' },
        { id: '3', name: '', value: 'x' },
        { id: '4', name: 'X-Request-Id', value: 'abc' },
      ])
    ).toEqual({
      Accept: 'application/json',
      'X-Request-Id': 'abc',
    });
  });
});

describe('TryItOutHeadersEditor', () => {
  it('renders Accept and Authorization by default', () => {
    render(<TryItOutHeadersEditor />);

    expect(screen.getByRole('heading', { name: 'Headers' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Accept')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Authorization')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bearer <token>')).toBeInTheDocument();
  });

  it('updates Authorization value', async () => {
    const user = userEvent.setup();
    render(<TryItOutHeadersEditor />);

    const authValue = screen.getByLabelText(/Authorization Value/);
    await user.type(authValue, 'Bearer secret');
    expect(authValue).toHaveValue('Bearer secret');
  });

  it('adds and removes a custom header', async () => {
    const user = userEvent.setup();
    render(<TryItOutHeadersEditor />);

    await user.click(screen.getByRole('button', { name: 'Add header' }));

    const customName = screen.getByLabelText(/Name Custom header/);
    const customValue = screen.getByLabelText(/Custom header Value/);

    await user.type(customName, 'X-Trace');
    await user.type(customValue, '1');

    expect(screen.getByDisplayValue('X-Trace')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.queryByDisplayValue('X-Trace')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Accept')).toBeInTheDocument();
  });

  it('does not allow removing locked headers', () => {
    render(<TryItOutHeadersEditor />);

    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('supports controlled headers', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [headers, setHeaders] = useState<HeaderEntry[]>(createDefaultHeaders());

      return <TryItOutHeadersEditor headers={headers} onHeadersChange={setHeaders} />;
    };

    render(<Controlled />);

    const acceptValue = screen.getByLabelText(/^Accept Value$/);
    await user.clear(acceptValue);
    await user.type(acceptValue, 'text/plain');

    expect(acceptValue).toHaveValue('text/plain');
  });
});
