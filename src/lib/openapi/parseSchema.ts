import { load } from 'js-yaml';

import type { SchemaFormat } from './types';

interface ParseResult {
  data: Record<string, unknown> | null;
  error: string | null;
}

export const parseSchemaContent = (content: string, format: SchemaFormat): ParseResult => {
  if (!content.trim()) {
    return { data: null, error: 'Schema is empty' };
  }

  try {
    if (format === 'json') {
      const data = JSON.parse(content) as unknown;

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { data: null, error: 'OpenAPI schema must be a JSON object' };
      }

      return { data: data as Record<string, unknown>, error: null };
    }

    const data = load(content) as unknown;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { data: null, error: 'OpenAPI schema must be a YAML object' };
    }

    return { data: data as Record<string, unknown>, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse schema';
    return { data: null, error: message };
  }
};
