import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'ru' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'ru',
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => {
        const current = get().language;
        const next = current === 'ru' ? 'en' : 'ru';
        set({ language: next });
      },
    }),
    {
      name: 'swagger-language-storage',
    }
  )
);
