import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeToggle } from '@/components/common/ThemeToggle/ThemeToggle';
import { useThemeStore } from '@/store';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    headerLang: {
      theme: {
        switchToLight: 'Switch to light mode',
        switchToDark: 'Switch to dark mode',
      },
    },
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'dark' });
  });

  it('renders a button labeled for switching to light mode when theme is dark', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('renders a button labeled for switching to dark mode when theme is light', () => {
    useThemeStore.setState({ theme: 'light' });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });

  it('toggles theme from dark to light on click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Switch to light mode' }));

    expect(useThemeStore.getState().theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
  });

  it('toggles theme from light to dark on click', async () => {
    const user = userEvent.setup();
    useThemeStore.setState({ theme: 'light' });

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(useThemeStore.getState().theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
  });
});
