import { en } from './en';
import { ru } from './ru';

export const locales = {
  ru,
  en,
};

export type Locale = keyof typeof locales;
export type LocaleContent = typeof ru;

export function getLocale(locale: Locale = 'ru'): LocaleContent {
  return locales[locale] || locales.ru;
}
