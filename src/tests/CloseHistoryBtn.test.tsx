import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import CloseHistoryBtn from '@/components/HistoryDetails/CloseHistoryBtn';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('CloseHistoryBtn', () => {
  it('renders button', () => {
    render(<CloseHistoryBtn />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls router.push on click', async () => {
    render(<CloseHistoryBtn />);
    await userEvent.click(screen.getByRole('button'));
    expect(pushMock).toHaveBeenCalledWith('/history');
  });
});
