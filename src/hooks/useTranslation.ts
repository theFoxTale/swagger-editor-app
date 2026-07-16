'use client';

import { en, ru, type Translation } from '@/lib';
import { useLanguageStore } from '@/store/useLanguageStore';

export function useTranslation(): Translation {
  const language = useLanguageStore((state) => state.language);
  return language === 'ru' ? ru : en;
}
