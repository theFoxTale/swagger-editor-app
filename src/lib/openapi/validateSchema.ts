import { detectFormat } from './detectFormat';
import { parseSchemaContent } from './parseSchema';
import type { ValidationResult } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const validateSchema = (content: string): ValidationResult => {
  const format = detectFormat(content);
  const { data, error } = parseSchemaContent(content, format);

  if (error || !data) {
    return {
      isValid: false,
      errors: [error ?? 'Unknown parse error'],
      parsed: null,
    };
  }

  const errors: string[] = [];

  if (!('openapi' in data) && !('swagger' in data)) {
    errors.push('Missing required field: openapi or swagger');
  }

  if ('openapi' in data && typeof data.openapi !== 'string') {
    errors.push('Field "openapi" must be a string');
  }

  if ('info' in data) {
    if (!isRecord(data.info)) {
      errors.push('Field "info" must be an object');
    } else {
      if (typeof data.info.title !== 'string') {
        errors.push('Field "info.title" is required and must be a string');
      }
      if (typeof data.info.version !== 'string') {
        errors.push('Field "info.version" is required and must be a string');
      }
    }
  } else {
    errors.push('Missing required field: info');
  }

  if ('paths' in data && data.paths !== undefined && !isRecord(data.paths)) {
    errors.push('Field "paths" must be an object');
  }

  return {
    isValid: errors.length === 0,
    errors,
    parsed: errors.length === 0 ? data : null,
  };
};
