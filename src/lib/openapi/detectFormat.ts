import type { SchemaFormat } from './types';

export const detectFormat = (content: string): SchemaFormat => {
  const trimmed = content.trim();

  if (!trimmed) {
    return 'yaml';
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }

  return 'yaml';
};
