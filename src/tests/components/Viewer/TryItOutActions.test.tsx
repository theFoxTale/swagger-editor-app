import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TryItOutActions } from '@/components/Viewer/TryItOutActions';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      tryItOutSend: 'Send',
      tryItOutSending: 'Sending…',
      tryItOutClear: 'Clear',
      tryItOutCopyCurl: 'Copy as cURL',
      tryItOutCopiedCurl: 'Copied cURL',
      tryItOutSendDisabledHint:
        'Request execution will be available once the server proxy is connected.',
    },
  }),
}));

describe('TryItOutActions', () => {
  it('disables Send when onSend is missing', () => {
    render(<TryItOutActions onClear={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeEnabled();
  });

  it('disables Clear when onClear is missing', () => {
    render(<TryItOutActions onSend={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });

  it('calls onClear when Clear is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<TryItOutActions onSend={() => undefined} onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('enables Send when onSend is provided', () => {
    render(
      <TryItOutActions sendDisabled={false} onSend={() => undefined} onClear={() => undefined} />
    );

    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('shows sending label while request is in flight', () => {
    render(
      <TryItOutActions
        sendDisabled={false}
        sending
        onSend={() => undefined}
        onClear={() => undefined}
      />
    );

    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });

  it('copies cURL when the copy button is clicked', async () => {
    const user = userEvent.setup();
    const onCopyCurl = vi.fn();

    render(
      <TryItOutActions onSend={() => undefined} onClear={() => undefined} onCopyCurl={onCopyCurl} />
    );

    await user.click(screen.getByRole('button', { name: 'Copy as cURL' }));
    expect(onCopyCurl).toHaveBeenCalledTimes(1);
  });

  it('shows copied label after a successful copy', () => {
    render(
      <TryItOutActions
        copyCurlSuccess
        onSend={() => undefined}
        onClear={() => undefined}
        onCopyCurl={() => undefined}
      />
    );

    expect(screen.getByRole('button', { name: 'Copied cURL' })).toBeInTheDocument();
  });

  it('disables copy when request state is invalid', () => {
    render(
      <TryItOutActions
        sendDisabled
        copyCurlDisabled
        sendDisabledHint="No server URL is defined in this schema."
        onSend={() => undefined}
        onClear={() => undefined}
        onCopyCurl={() => undefined}
      />
    );

    expect(screen.getByRole('button', { name: 'Copy as cURL' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Copy as cURL' })).toHaveAttribute(
      'title',
      'No server URL is defined in this schema.'
    );
  });
});
