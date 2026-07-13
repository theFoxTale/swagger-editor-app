export type SchemaFormat = 'yaml' | 'json';

export interface ParsedSchema {
  data: Record<string, unknown>;
  format: SchemaFormat;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  parsed: Record<string, unknown> | null;
}
