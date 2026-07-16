'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { supabase } from '@/lib/supabase';

import styles from './AuthForm.module.css';

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
    <section className={styles.card}>
      <div className={styles.glowTop} aria-hidden="true" />
      <div className={styles.glowBottom} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.badge}>Swagger / OpenAPI UI</p>

          <h1 className={styles.title}>{isSignUp ? 'Create your account' : 'Welcome back'}</h1>

          <p className={styles.subtitle}>
            {isSignUp
              ? 'Join Swagger/OpenAPI UI and start building better APIs.'
              : 'Sign in to continue working with your API schemas.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="email" className={styles.fieldLabel}>
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={styles.input}
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.fieldLabel}>
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={styles.input}
              placeholder="Enter your password"
            />
          </div>

          {isSignUp ? (
            <div>
              <label htmlFor="confirm-password" className={styles.fieldLabel}>
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={styles.input}
                placeholder="Repeat your password"
              />
            </div>
          ) : null}

          {error ? (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          ) : null}

          {success ? <p className={styles.success}>{success}</p> : null}

          <button type="submit" disabled={isLoading} className={styles.submit}>
            {isLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerLabel}>OpenAPI</span>
          <div className={styles.dividerLine} />
        </div>

        <p className={styles.footer}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link href={isSignUp ? '/auth/sign-in' : '/auth/sign-up'} className={styles.link}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </section>
  );
};
