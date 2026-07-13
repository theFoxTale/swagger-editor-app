'use client';

import { useState } from 'react';

type AuthFormProps = {
  mode: 'signin' | 'signup';
};

export const AuthForm = ({ mode }: AuthFormProps) => {
  const isSignUp = mode === 'signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border p-8 shadow">
      <h1 className="mb-6 text-center text-3xl font-bold">
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block">Email</label>

          <input
            className="w-full rounded-lg border px-4 py-3"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block">Password</label>

          <input
            className="w-full rounded-lg border px-4 py-3"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {isSignUp && (
          <div>
            <label className="mb-2 block">Confirm Password</label>

            <input
              className="w-full rounded-lg border px-4 py-3"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        <button
          className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:opacity-90"
          type="submit"
        >
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
