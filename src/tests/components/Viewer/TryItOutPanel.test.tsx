import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TryItOutPanel } from '@/components/Viewer/TryItOutPanel';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      tryItOut: 'Try it out',
      cancelTryItOut: 'Cancel',
      tryItOutPanel: 'Try it out request form',
      tryItOutPlaceholder: 'Parameter and body inputs will appear here.',
      tryItOutParametersTitle: 'Parameters',
      tryItOutParametersEmpty: 'This endpoint has no parameters to fill.',
      tryItOutRequired: 'required',
      tryItOutUnset: '—',
      tryItOutBooleanTrue: 'true',
      tryItOutBooleanFalse: 'false',
      tryItOutArrayHint: 'Enter a JSON array, e.g. ["a", "b"]',
      tryItOutObjectHint: 'Enter a JSON object, e.g. {"key": "value"}',
    },
  }),
}));

describe('TryItOutPanel', () => {
  it('shows Try it out and hides the form region by default', () => {
    render(<TryItOutPanel />);

    expect(screen.getByRole('button', { name: 'Try it out' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(
      screen.queryByRole('region', { name: 'Try it out request form' })
    ).not.toBeInTheDocument();
  });

  it('opens the panel with a placeholder, then cancels', async () => {
    const user = userEvent.setup();
    render(<TryItOutPanel />);

    await user.click(screen.getByRole('button', { name: 'Try it out' }));

    expect(screen.getByRole('region', { name: 'Try it out request form' })).toBeInTheDocument();
    expect(screen.getByText('Parameter and body inputs will appear here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('region', { name: 'Try it out request form' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try it out' })).toBeInTheDocument();
  });

  it('renders custom children when active', async () => {
    const user = userEvent.setup();
    render(
      <TryItOutPanel>
        <label htmlFor="pet-id">Pet id</label>
        <input id="pet-id" />
      </TryItOutPanel>
    );

    await user.click(screen.getByRole('button', { name: 'Try it out' }));

    expect(screen.getByLabelText('Pet id')).toBeInTheDocument();
    expect(
      screen.queryByText('Parameter and body inputs will appear here.')
    ).not.toBeInTheDocument();
  });

  it('supports controlled active state', async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();

    const { rerender } = render(<TryItOutPanel active={false} onActiveChange={onActiveChange} />);

    await user.click(screen.getByRole('button', { name: 'Try it out' }));
    expect(onActiveChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();

    rerender(<TryItOutPanel active onActiveChange={onActiveChange} />);
    expect(screen.getByRole('region', { name: 'Try it out request form' })).toBeInTheDocument();
  });
});
