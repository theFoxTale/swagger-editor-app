import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { supabase } from '@/lib/supabase';

import { AuthForm } from './AuthForm';

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
  },
}));

const mockedSignIn = supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>;
const mockedSignUp = supabase.auth.signUp as ReturnType<typeof vi.fn>;

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in form', () => {
    render(<AuthForm mode="signin" />);

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirm password/i)).not.toBeInTheDocument();
  });

  it('renders sign up form', () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('shows error when email is empty', async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="signin" />);

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('shows error for short password', async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="signin" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), '123');

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows error when password has no letter', async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="signin" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), '12345678!');

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByText(/at least one letter/i)).toBeInTheDocument();
  });

  it('shows error when password has no number', async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="signin" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password!');

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByText(/at least one number/i)).toBeInTheDocument();
  });

  it('shows error when password has no special character', async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="signin" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByText(/at least one special character/i)).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password2!');

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('signs in successfully and redirects to home page', async () => {
    mockedSignIn.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    const user = userEvent.setup();

    render(<AuthForm mode="signin" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1!');

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(mockedSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password1!',
    });

    expect(pushMock).toHaveBeenCalledWith('/');
    expect(refreshMock).toHaveBeenCalled();
  });

  it('shows error when sign in fails', async () => {
    mockedSignIn.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        name: 'AuthApiError',
        message: 'Invalid login credentials',
        status: 400,
        code: 'invalid_credentials',
      },
    } as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);

    const user = userEvent.setup();

    render(<AuthForm mode="signin" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1!');

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it('signs up successfully', async () => {
    mockedSignUp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });

    const user = userEvent.setup();

    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1!');

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockedSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password1!',
    });

    expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();

    expect(pushMock).toHaveBeenCalledWith('/');
    expect(refreshMock).toHaveBeenCalled();
  });

  it('shows Supabase error when sign up fails', async () => {
    mockedSignUp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        name: 'AuthApiError',
        message: 'User already registered',
        status: 400,
        code: 'user_already_exists',
      },
    } as Awaited<ReturnType<typeof supabase.auth.signUp>>);

    const user = userEvent.setup();

    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1!');

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
  });
});
