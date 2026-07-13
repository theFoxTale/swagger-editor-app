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
    <header className="flex items-center justify-between border-b px-8 py-4">
      <Link href="/" className="text-2xl font-bold">
        Swagger Editor
      </Link>

      <nav className="flex items-center gap-6">
        <Link href="/about">About</Link>
        {!isLoading && (
          <>
            {isAuthenticated ? (
              <>
                <Link href="/history">History</Link>

                <button type="button" onClick={handleSignOut} className="cursor-pointer">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/sign-in">Sign In</Link>
                <Link href="/auth/sign-up">Sign Up</Link>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
};
