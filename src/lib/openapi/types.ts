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

/** Методы HTTP, поддерживаемые OpenAPI. */
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head' | 'trace';

export const HTTP_METHODS: readonly HttpMethod[] = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head',
  'trace',
] as const;

/** Берем по OpenAPI 3.x. */
export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

export const PARAMETER_LOCATIONS: readonly ParameterLocation[] = [
  'path',
  'query',
  'header',
  'cookie',
] as const;

export const DEFAULT_OPERATION_TAG = 'default';

export type OpenApiSchema = Record<string, unknown>;

export interface ApiInfo {
  title: string;
  version: string;
  description?: string;
}

export interface ApiServer {
  url: string;
  description?: string;
}

export interface TagDefinition {
  name: string;
  description?: string;
}

export interface OperationParameter {
  name: string;
  in: ParameterLocation;
  required: boolean;
  description?: string;
  schema?: OpenApiSchema;
  example?: unknown;
  deprecated?: boolean;
}

export interface MediaTypeObject {
  schema?: OpenApiSchema;
  example?: unknown;
  examples?: Record<string, { value?: unknown; summary?: string; description?: string }>;
}

export interface RequestBody {
  required: boolean;
  description?: string;
  content: Record<string, MediaTypeObject>;
}

export interface ResponseHeader {
  description?: string;
  schema?: OpenApiSchema;
  required?: boolean;
}

export interface ResponseObject {
  statusCode: string;
  description: string;
  content?: Record<string, MediaTypeObject>;
  headers?: Record<string, ResponseHeader>;
}

/** Карта требований безопасности: имя схемы → области действия. */
export type SecurityRequirement = Record<string, string[]>;

export interface Operation {
  id: string;
  method: HttpMethod;
  path: string;
  summary?: string;
  description?: string;
  operationId?: string;
  tags: string[];
  parameters: OperationParameter[];
  requestBody?: RequestBody;
  responses: ResponseObject[];
  security?: SecurityRequirement[];
  deprecated?: boolean;
}

export interface TagGroup {
  name: string;
  description?: string;
  operations: Operation[];
}

/** Данные спецификации, подготовленные для окна просмотра (контракт) */
export interface ExtractedEndpoints {
  info: ApiInfo;
  servers: ApiServer[];
  tags: TagDefinition[];
  tagGroups: TagGroup[]; // Операции, сгруппированные по тегам для UI с аккордеоном.
  operations: Operation[]; // Плоский список всех операций
  document: Record<string, unknown>; // OpenAPI, внутри которого распознаются $ref
}
