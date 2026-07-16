'use client';

import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export const AuthInitializer = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    void checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth]);

  return null;
};
