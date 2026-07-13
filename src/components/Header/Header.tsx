'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

export const Header = () => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(Boolean(session));
      setIsLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    setIsAuthenticated(false);

    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#02050d]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/10 text-xl font-bold text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            S
          </div>

          <div>
            <p className="font-semibold text-white transition group-hover:text-cyan-300">
              Swagger/OpenAPI UI
            </p>
            <p className="text-xs text-slate-500">OpenAPI Editor</p>
          </div>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-slate-400 transition hover:text-cyan-300">
            Editor
          </Link>

          <Link href="/about" className="text-slate-400 transition hover:text-cyan-300">
            About
          </Link>

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href="/history" className="text-slate-400 transition hover:text-cyan-300">
                    History
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-lg border border-purple-500/50 px-4 py-2 text-purple-200 transition hover:bg-purple-500/10"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    className="rounded-lg border border-cyan-400/50 px-4 py-2 text-cyan-100 transition hover:bg-cyan-400/10"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/auth/sign-up"
                    className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 font-medium text-white shadow-[0_0_18px_rgba(34,211,238,0.2)] transition hover:brightness-110"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
