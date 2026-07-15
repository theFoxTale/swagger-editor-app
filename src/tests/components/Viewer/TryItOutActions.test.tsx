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
      tryItOutSendDisabledHint:
        'Request execution will be available once the server proxy is connected.',
    },
  }),
}));

describe('TryItOutActions', () => {
  it('renders Send disabled by default and Clear enabled when onClear is provided', () => {
    render(<TryItOutActions onClear={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeEnabled();
  });

  it('disables Clear when onClear is missing', () => {
    render(<TryItOutActions />);

    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });

  it('calls onClear when Clear is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<TryItOutActions onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('enables Send when sendDisabled is false', () => {
    render(
      <TryItOutActions sendDisabled={false} onSend={() => undefined} onClear={() => undefined} />
    );

    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('shows sending label while request is in flight', () => {
    render(<TryItOutActions sendDisabled={false} sending onClear={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });
});
