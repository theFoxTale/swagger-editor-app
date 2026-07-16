import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { supabase } from '@/lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { email: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,

      login: async (email, password) => {
        set({ isLoading: true });

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          set({ isLoading: false });
          throw error;
        }

        set({
          isAuthenticated: Boolean(data.session),
          user: data.user?.email ? { email: data.user.email } : null,
          token: data.session?.access_token ?? null,
          isLoading: false,
        });
      },

      logout: async () => {
        set({ isLoading: true });

        await supabase.auth.signOut();

        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        set({ isLoading: true });

        const {
          data: { session },
        } = await supabase.auth.getSession();

        set({
          isAuthenticated: Boolean(session),
          user: session?.user.email ? { email: session.user.email } : null,
          token: session?.access_token ?? null,
          isLoading: false,
        });
      },
    }),
    {
      name: 'swagger-auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
