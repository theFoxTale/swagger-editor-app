import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,

      login: async (email) => {
        set({ isLoading: true });
        // TODO: переделать на реальный запрос к серверу
        await new Promise((resolve) => setTimeout(resolve, 800));
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
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
      },

      checkAuth: () => {
        const state = get();
        if (state.token) {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'swagger-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
