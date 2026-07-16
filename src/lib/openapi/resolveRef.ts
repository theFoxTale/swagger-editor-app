import type { OpenApiSchema } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const unescapeJsonPointerToken = (token: string): string =>
  token.replaceAll('~1', '/').replaceAll('~0', '~');

/** true для ссылок на локальный JSON Pointer (`#/...`). */
export const isLocalRef = (ref: string): boolean => ref.startsWith('#/');

/**
 * Распознаёт JSON Pointer для документа OpenAPI.
 * Поддерживает указатели вида `#/components/schemas/Pet`.
 */
export const resolveJsonPointer = (document: Record<string, unknown>, pointer: string): unknown => {
  if (pointer === '#' || pointer === '') {
    return document;
  }

  if (!pointer.startsWith('#/')) {
    return undefined;
  }

  const tokens = pointer.slice(2).split('/').map(unescapeJsonPointerToken);

  let current: unknown = document;

  for (const token of tokens) {
    if (!isRecord(current) || !(token in current)) {
      return undefined;
    }
    current = current[token];
  }

  return current;
};

export interface ResolveSchemaOptions {
  /** Максимальная глубина для раскрытия вложенных $ref
   * защита от потенциально бесконечных циклов).
   */
  maxDepth?: number;
}

const DEFAULT_MAX_DEPTH = 8;

/**
 * Распознает `$ref` (и вложенные ссылки внутри properties/items/composites)
 * относительно локального документа OpenAPI. Внешние ссылки остаются без изменений.
 */
export const resolveSchema = (
  schema: OpenApiSchema | undefined,
  document: Record<string, unknown> | null | undefined,
  options: ResolveSchemaOptions = {},
  seen: Set<string> = new Set(),
  depth = 0
): OpenApiSchema | undefined => {
  if (!schema) {
    return undefined;
  }

  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  if (depth > maxDepth) {
    return schema;
  }

  if (!document) {
    return schema;
  }

  const ref = typeof schema.$ref === 'string' ? schema.$ref : undefined;

  if (ref) {
    if (!isLocalRef(ref)) {
      return schema;
    }

    if (seen.has(ref)) {
      return { $ref: ref };
    }

    const target = resolveJsonPointer(document, ref);
    if (!isRecord(target)) {
      return schema;
    }

    const nextSeen = new Set(seen);
    nextSeen.add(ref);

    const siblings = { ...schema };
    delete siblings.$ref;

    const resolvedTarget = resolveSchema(
      target as OpenApiSchema,
      document,
      options,
      nextSeen,
      depth + 1
    );

    if (!resolvedTarget) {
      return schema;
    }

    return {
      ...resolvedTarget,
      ...siblings,
    };
  }

  const resolved: OpenApiSchema = { ...schema };

  if (isRecord(schema.properties)) {
    const properties: Record<string, unknown> = {};
    for (const [name, property] of Object.entries(schema.properties)) {
      properties[name] = isRecord(property)
        ? resolveSchema(property as OpenApiSchema, document, options, seen, depth + 1)
        : property;
    }
    resolved.properties = properties;
  }

  if (isRecord(schema.items)) {
    resolved.items = resolveSchema(
      schema.items as OpenApiSchema,
      document,
      options,
      seen,
      depth + 1
    );
  }

  if (isRecord(schema.additionalProperties)) {
    resolved.additionalProperties = resolveSchema(
      schema.additionalProperties as OpenApiSchema,
      document,
      options,
      seen,
      depth + 1
    );
  }

  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    const value = schema[key];
    if (Array.isArray(value)) {
      resolved[key] = value.map((entry) =>
        isRecord(entry)
          ? resolveSchema(entry as OpenApiSchema, document, options, seen, depth + 1)
          : entry
      );
    }
  }

  return resolved;
};
