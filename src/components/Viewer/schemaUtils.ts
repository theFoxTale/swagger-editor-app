import { resolveSchema } from '@/lib/openapi';
import type { MediaTypeObject, OpenApiSchema, RequestBody } from '@/lib/openapi';

export const getSchemaTypeLabel = (schema?: OpenApiSchema): string => {
  if (!schema) {
    return '—';
  }

  if (typeof schema.$ref === 'string') {
    const refName = schema.$ref.split('/').pop();
    return refName && refName.length > 0 ? refName : schema.$ref;
  }

  if (typeof schema.type === 'string') {
    if (schema.type === 'array' && typeof schema.items === 'object' && schema.items !== null) {
      const itemsLabel = getSchemaTypeLabel(schema.items as OpenApiSchema);
      return `array<${itemsLabel}>`;
    }

    if (typeof schema.format === 'string') {
      return `${schema.type} (${schema.format})`;
    }

    return schema.type;
  }

  return 'object';
};

export const formatJsonValue = (value: unknown, pretty = false): string | null => {
  if (value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value, null, pretty ? 2 : undefined);
  } catch {
    return String(value);
  }
};

export const getResolvedSchema = (
  schema: OpenApiSchema | undefined,
  document?: Record<string, unknown> | null
): OpenApiSchema | undefined => resolveSchema(schema, document);

/** Preferred example for a media type: named examples → example → schema.example. */
export const getMediaTypeExample = (
  mediaType: MediaTypeObject,
  document?: Record<string, unknown> | null
): unknown => {
  if (mediaType.examples) {
    const firstExample = Object.values(mediaType.examples)[0];
    if (firstExample && firstExample.value !== undefined) {
      return firstExample.value;
    }
  }

  if (mediaType.example !== undefined) {
    return mediaType.example;
  }

  if (mediaType.schema && mediaType.schema.example !== undefined) {
    return mediaType.schema.example;
  }

  const resolved = getResolvedSchema(mediaType.schema, document);
  if (resolved && resolved.example !== undefined) {
    return resolved.example;
  }

  return undefined;
};

export const getRequestBodyContentTypes = (requestBody: RequestBody): string[] =>
  Object.keys(requestBody.content);

export const getMediaTypeContentTypes = (content?: Record<string, MediaTypeObject>): string[] =>
  content ? Object.keys(content) : [];

const numericStatus = (statusCode: string): number => {
  const parsed = Number(statusCode);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};

/** Сортировка поля responses: 1xx→5xx. */
export const sortResponses = <T extends { statusCode: string }>(responses: T[]): T[] =>
  [...responses].sort((left, right) => {
    if (left.statusCode === 'default' && right.statusCode !== 'default') {
      return 1;
    }
    if (right.statusCode === 'default' && left.statusCode !== 'default') {
      return -1;
    }

    return numericStatus(left.statusCode) - numericStatus(right.statusCode);
  });

export type ResponseStatusTone =
  'info' | 'success' | 'redirect' | 'clientError' | 'serverError' | 'default';

export const getResponseStatusTone = (statusCode: string): ResponseStatusTone => {
  if (statusCode === 'default') {
    return 'default';
  }

  const code = Number(statusCode);
  if (Number.isNaN(code)) {
    return 'default';
  }
  if (code >= 100 && code < 200) {
    return 'info';
  }
  if (code >= 200 && code < 300) {
    return 'success';
  }
  if (code >= 300 && code < 400) {
    return 'redirect';
  }
  if (code >= 400 && code < 500) {
    return 'clientError';
  }
  if (code >= 500 && code < 600) {
    return 'serverError';
  }

  return 'default';
};
