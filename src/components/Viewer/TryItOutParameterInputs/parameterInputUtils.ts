import type { OpenApiSchema, OperationParameter } from '@/lib/openapi';

import { getResolvedSchema } from '../schemaUtils';

export type ParameterInputKind = 'boolean' | 'number' | 'enum' | 'string' | 'array' | 'object';

export type ParameterValues = Record<string, string>;

export const getParameterKey = (parameter: OperationParameter): string =>
  `${parameter.in}:${parameter.name}`;

export const getParameterInputKind = (
  schema?: OpenApiSchema,
  document?: Record<string, unknown> | null
): ParameterInputKind => {
  const resolved = getResolvedSchema(schema, document) ?? schema;

  if (!resolved) {
    return 'string';
  }

  if (Array.isArray(resolved.enum) && resolved.enum.length > 0) {
    return 'enum';
  }

  const type = typeof resolved.type === 'string' ? resolved.type : undefined;

  if (type === 'boolean') {
    return 'boolean';
  }

  if (type === 'integer' || type === 'number') {
    return 'number';
  }

  if (type === 'array') {
    return 'array';
  }

  if (type === 'object') {
    return 'object';
  }

  return 'string';
};

const valueToFormString = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export const getParameterInitialValue = (
  parameter: OperationParameter,
  document?: Record<string, unknown> | null
): string => {
  if (parameter.example !== undefined) {
    return valueToFormString(parameter.example);
  }

  const resolved = getResolvedSchema(parameter.schema, document) ?? parameter.schema;
  if (resolved?.example !== undefined) {
    return valueToFormString(resolved.example);
  }

  if (resolved?.default !== undefined) {
    return valueToFormString(resolved.default);
  }

  return '';
};

export const createInitialParameterValues = (
  parameters: OperationParameter[],
  document?: Record<string, unknown> | null
): ParameterValues => {
  const values: ParameterValues = {};

  for (const parameter of parameters) {
    values[getParameterKey(parameter)] = getParameterInitialValue(parameter, document);
  }

  return values;
};

export const getEnumOptions = (
  schema?: OpenApiSchema,
  document?: Record<string, unknown> | null
): string[] => {
  const resolved = getResolvedSchema(schema, document) ?? schema;
  if (!resolved || !Array.isArray(resolved.enum)) {
    return [];
  }

  return resolved.enum.map((value) => valueToFormString(value));
};
