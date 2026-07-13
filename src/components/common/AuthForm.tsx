'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { supabase } from '@/lib/supabase';

type AuthFormProps = {
  mode: 'signin' | 'signup';
};

export const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();

  const isSignUp = mode === 'signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }

    if (!/[A-Za-z]/.test(password)) {
      setError('Password must contain at least one letter');
      return;
    }

    if (!/\d/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Password must contain at least one special character');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      setSuccess('Account created successfully');
      setIsLoading(false);
      router.push('/');
      router.refresh();
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Invalid email or password');
      setIsLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <section className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-cyan-500/50 bg-[#050816]/95 p-8 shadow-[0_0_40px_rgba(0,212,255,0.15)]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-purple-600/15 blur-3xl" />

      <div className="relative">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
            Swagger / OpenAPI UI
          </p>

          <h1 className="text-3xl font-bold text-white">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            {isSignUp
              ? 'Join Swagger/OpenAPI UI and start building better APIs.'
              : 'Sign in to continue working with your API schemas.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#080d1c] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#080d1c] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              placeholder="Enter your password"
            />
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#080d1c] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                placeholder="Repeat your password"
              />
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 py-3 font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs uppercase tracking-wider text-slate-600">OpenAPI</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <p className="text-center text-sm text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link
            href={isSignUp ? '/auth/sign-in' : '/auth/sign-up'}
            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </section>
  );
};
