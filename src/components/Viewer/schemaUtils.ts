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

/** Предпочтительный пример для media type: named examples → example → schema.example. */
export const getMediaTypeExample = (mediaType: MediaTypeObject): unknown => {
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

  return undefined;
};

export const getRequestBodyContentTypes = (requestBody: RequestBody): string[] =>
  Object.keys(requestBody.content);
