'use client';

import { getLocale, type LocaleContent } from '@/locales';
import { useLanguageStore } from '@/store/useLanguageStore';

export function useTranslation(): LocaleContent {
  const language = useLanguageStore((state) => state.language);
  return getLocale(language);
}
