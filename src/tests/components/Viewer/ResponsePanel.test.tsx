import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { formatResponseBody, ResponsePanel } from '@/components/Viewer/ResponsePanel';
import type { ProxySuccessResponse } from '@/lib/proxy';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      tryItOutResponseTitle: 'Response',
      tryItOutResponseBodyTab: 'Body',
      tryItOutResponseHeadersTab: 'Headers',
      tryItOutResponseDuration: 'Duration',
      tryItOutResponseBodyEmpty: 'Empty response body.',
      tryItOutResponseHeadersEmpty: 'No response headers.',
      tryItOutHeaderName: 'Name',
      tryItOutHeaderValue: 'Value',
    },
  }),
}));

const successResponse: ProxySuccessResponse = {
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: {
    'content-type': 'application/json',
    'x-request-id': 'abc-123',
  },
  body: '{"id":1,"name":"Rex"}',
  durationMs: 42,
};

describe('formatResponseBody', () => {
  it('pretty-prints JSON bodies', () => {
    expect(formatResponseBody('{"id":1}', 'application/json')).toBe('{\n  "id": 1\n}');
  });

  it('returns plain text as-is', () => {
    expect(formatResponseBody('hello', 'text/plain')).toBe('hello');
  });
});

describe('ResponsePanel', () => {
  it('renders status, duration, and response body', () => {
    render(<ResponsePanel response={successResponse} />);

    expect(screen.getByRole('region', { name: 'Response' })).toBeInTheDocument();
    expect(screen.getByText('200 OK')).toBeInTheDocument();
    expect(screen.getByText('Duration: 42ms')).toBeInTheDocument();
    expect(screen.getByText(/"name": "Rex"/)).toBeInTheDocument();
  });

  it('switches to the headers tab', async () => {
    const user = userEvent.setup();
    render(<ResponsePanel response={successResponse} />);

    await user.click(screen.getByRole('tab', { name: /Headers/ }));

    expect(screen.getByText('content-type')).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();
    expect(screen.getByText('x-request-id')).toBeInTheDocument();
    expect(screen.getByText('abc-123')).toBeInTheDocument();
  });

  it('shows empty body message', () => {
    render(
      <ResponsePanel
        response={{
          ...successResponse,
          body: '',
          headers: {},
        }}
      />
    );

    expect(screen.getByText('Empty response body.')).toBeInTheDocument();
  });

  it('shows client-error status styling for 404', () => {
    const { container } = render(
      <ResponsePanel
        response={{
          ...successResponse,
          status: 404,
          statusText: 'Not Found',
        }}
      />
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    expect(container.querySelector('[class*="statusClientError"]')).toBeTruthy();
  });
});
