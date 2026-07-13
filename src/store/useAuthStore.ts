import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAuthCookie, removeAuthCookie, setAuthCookie } from '@/lib';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;

  user: { email: string } | null;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,

      login: async (email) => {
        set({ isLoading: true });
        // TODO: переделать на реальный запрос к серверу
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockToken = 'mock-token-' + Date.now();
        setAuthCookie(mockToken);

        set({
          isAuthenticated: true,
          user: { email },
          token: 'mock-token',
          isLoading: false,
        });
      },

      logout: async () => {
        set({ isLoading: true });
        // TODO: переделать на реальный запрос к серверу
        await new Promise((resolve) => setTimeout(resolve, 800));

        removeAuthCookie();

        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
      },

      checkAuth: () => {
        const token = getAuthCookie();
        if (token) {
          set({
            isAuthenticated: true,
            token,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
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
