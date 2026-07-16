import { render, screen, waitFor } from '@testing-library/react';
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
        tryItOutNoServerUrl: 'No server URL is defined in this schema.',
        tryItOutSendError: 'Request failed. Check the URL, parameters, and try again.',
        tryItOutResponseTitle: 'Response',
        tryItOutResponseBodyTab: 'Body',
        tryItOutResponseHeadersTab: 'Headers',
        tryItOutResponseDuration: 'Duration',
        tryItOutResponseBodyEmpty: 'Empty response body.',
        tryItOutResponseHeadersEmpty: 'No response headers.',
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
  id: 'listPets',
  method: 'get',
  path: '/pets',
  summary: 'List pets',
  tags: ['pet'],
  parameters: [
    {
      name: 'verbose',
      in: 'query',
      required: false,
      schema: { type: 'boolean' },
    },
  ],
  responses: [],
};

describe('TryItOutForm', () => {
  it('disables Send when server URL is missing', () => {
    render(<TryItOutForm operation={operation} />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute(
      'title',
      'No server URL is defined in this schema.'
    );
  });

  it('enables Send when server URL is provided', () => {
    render(<TryItOutForm operation={operation} serverUrl="https://api.example.com" />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('sends through /api/proxy and shows the response panel', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          body: '[]',
          durationMs: 15,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    render(<TryItOutForm operation={operation} serverUrl="https://api.example.com" />);

    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Response' })).toBeInTheDocument();
    });

    expect(screen.getByText('200 OK')).toBeInTheDocument();
    expect(screen.getByText('Duration: 15ms')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/proxy',
      expect.objectContaining({ method: 'POST' })
    );

    fetchSpy.mockRestore();
  });

  it.each([
    { status: 404, statusText: 'Not Found', body: '{"message":"not found"}' },
    { status: 500, statusText: 'Internal Server Error', body: '{"message":"server error"}' },
  ])(
    'shows upstream $status in the response panel without an error alert',
    async ({ status, statusText, body }) => {
      const user = userEvent.setup();
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: true,
            status,
            statusText,
            headers: { 'content-type': 'application/json' },
            body,
            durationMs: 8,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(<TryItOutForm operation={operation} serverUrl="https://api.example.com" />);

      await user.click(screen.getByRole('button', { name: 'Send' }));

      await waitFor(() => {
        expect(screen.getByRole('region', { name: 'Response' })).toBeInTheDocument();
      });

      expect(screen.getByText(`${status} ${statusText}`)).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      fetchSpy.mockRestore();
    }
  );

  it('shows an error alert for proxy transport failures, not the response panel', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: 'Upstream request failed.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(<TryItOutForm operation={operation} serverUrl="https://api.example.com" />);

    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Upstream request failed.');
    });

    expect(screen.queryByRole('region', { name: 'Response' })).not.toBeInTheDocument();

    fetchSpy.mockRestore();
  });

  it('resets form inputs when Clear is clicked', async () => {
    const user = userEvent.setup();
    render(<TryItOutForm operation={operation} serverUrl="https://api.example.com" />);

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
