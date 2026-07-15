import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TryItOutForm } from '@/components/Viewer/TryItOutForm';
import type { Operation } from '@/lib/openapi';

vi.mock('@/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks')>();

  return {
    ...actual,
    useTranslation: () => ({
      viewerLang: {
        tryItOutParametersTitle: 'Parameters',
        tryItOutParametersEmpty: 'This endpoint has no parameters to fill.',
        tryItOutRequired: 'required',
        tryItOutUnset: '—',
        tryItOutBooleanTrue: 'true',
        tryItOutBooleanFalse: 'false',
        tryItOutArrayHint: 'Enter a JSON array, e.g. ["a", "b"]',
        tryItOutObjectHint: 'Enter a JSON object, e.g. {"key": "value"}',
        tryItOutHeadersTitle: 'Headers',
        tryItOutHeaderName: 'Name',
        tryItOutHeaderValue: 'Value',
        tryItOutAddHeader: 'Add header',
        tryItOutRemoveHeader: 'Remove',
        tryItOutCustomHeader: 'Custom header',
        tryItOutAcceptPlaceholder: 'application/json',
        tryItOutAuthorizationPlaceholder: 'Bearer <token>',
        tryItOutBodyTitle: 'Request body',
        tryItOutBodyEmpty: 'This endpoint has no request body.',
        tryItOutBodyContentType: 'Request body content type',
        tryItOutBodyEditor: 'Request body editor',
        tryItOutBodyInvalidJson: 'Body is not valid JSON.',
        tryItOutSend: 'Send',
        tryItOutSending: 'Sending…',
        tryItOutClear: 'Clear',
        tryItOutSendDisabledHint:
          'Request execution will be available once the server proxy is connected.',
        requestBodyOptional: 'Optional',
        parametersPath: 'Path parameters',
        parametersQuery: 'Query parameters',
        parametersHeader: 'Header parameters',
        parametersCookie: 'Cookie parameters',
      },
    }),
  };
});

const operation: Operation = {
  id: 'createPet',
  method: 'post',
  path: '/pets',
  summary: 'Create a pet',
  tags: ['pet'],
  parameters: [
    {
      name: 'verbose',
      in: 'query',
      required: false,
      schema: { type: 'boolean' },
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        example: { id: 1, name: 'Rex' },
      },
    },
  },
  responses: [],
};

describe('TryItOutForm', () => {
  it('renders Send and Clear actions', () => {
    render(<TryItOutForm operation={operation} />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeEnabled();
  });

  it('resets form inputs when Clear is clicked', async () => {
    const user = userEvent.setup();
    render(<TryItOutForm operation={operation} />);

    const verbose = screen.getByLabelText(/verbose/);
    await user.selectOptions(verbose, 'true');
    expect(verbose).toHaveValue('true');

    const authValue = screen.getByLabelText(/Authorization Value/i);
    await user.type(authValue, 'Bearer secret');
    expect(authValue).toHaveValue('Bearer secret');

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText(/verbose/)).toHaveValue('');
    expect(screen.getByLabelText(/Authorization Value/i)).toHaveValue('');
  });
});
