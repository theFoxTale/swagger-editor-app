import {
  DEFAULT_OPERATION_TAG,
  HTTP_METHODS,
  PARAMETER_LOCATIONS,
  type ApiInfo,
  type ApiServer,
  type ExtractedEndpoints,
  type HttpMethod,
  type MediaTypeObject,
  type Operation,
  type OperationParameter,
  type ParameterLocation,
  type RequestBody,
  type ResponseHeader,
  type ResponseObject,
  type SecurityRequirement,
  type TagDefinition,
  type TagGroup,
} from './types';

const NON_OPERATION_PATH_KEYS = new Set([
  'parameters',
  'summary',
  'description',
  'servers',
  '$ref',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isHttpMethod = (value: string): value is HttpMethod =>
  HTTP_METHODS.includes(value as HttpMethod);

const isParameterLocation = (value: string): value is ParameterLocation =>
  PARAMETER_LOCATIONS.includes(value as ParameterLocation);

const parameterKey = (parameter: Pick<OperationParameter, 'name' | 'in'>) =>
  `${parameter.in}:${parameter.name}`;

const compareOperations = (left: Operation, right: Operation): number => {
  const pathCompare = left.path.localeCompare(right.path);
  if (pathCompare !== 0) {
    return pathCompare;
  }

  return HTTP_METHODS.indexOf(left.method) - HTTP_METHODS.indexOf(right.method);
};

const parseExamples = (
  value: Record<string, unknown>
): Record<string, { value?: unknown; summary?: string; description?: string }> => {
  const examples: Record<string, { value?: unknown; summary?: string; description?: string }> = {};

  for (const [name, exampleValue] of Object.entries(value)) {
    if (!isRecord(exampleValue)) {
      continue;
    }

    examples[name] = {
      value: exampleValue.value,
      summary: typeof exampleValue.summary === 'string' ? exampleValue.summary : undefined,
      description:
        typeof exampleValue.description === 'string' ? exampleValue.description : undefined,
    };
  }

  return examples;
};

const parseMediaTypeContent = (value: unknown): Record<string, MediaTypeObject> => {
  if (!isRecord(value)) {
    return {};
  }

  const content: Record<string, MediaTypeObject> = {};

  for (const [mediaType, mediaTypeValue] of Object.entries(value)) {
    if (!isRecord(mediaTypeValue)) {
      continue;
    }

    content[mediaType] = {
      schema: isRecord(mediaTypeValue.schema) ? mediaTypeValue.schema : undefined,
      example: mediaTypeValue.example,
      examples: isRecord(mediaTypeValue.examples)
        ? parseExamples(mediaTypeValue.examples)
        : undefined,
    };
  }

  return content;
};

const parseParameter = (value: unknown): OperationParameter | null => {
  if (!isRecord(value) || typeof value.name !== 'string' || typeof value.in !== 'string') {
    return null;
  }

  if (!isParameterLocation(value.in)) {
    return null;
  }

  return {
    name: value.name,
    in: value.in,
    required: value.required === true,
    description: typeof value.description === 'string' ? value.description : undefined,
    schema: isRecord(value.schema) ? value.schema : undefined,
    example: value.example,
    deprecated: value.deprecated === true ? true : undefined,
  };
};

const mergeParameters = (
  pathParameters: OperationParameter[],
  operationParameters: OperationParameter[]
): OperationParameter[] => {
  const merged = new Map<string, OperationParameter>();

  for (const parameter of pathParameters) {
    merged.set(parameterKey(parameter), parameter);
  }

  for (const parameter of operationParameters) {
    merged.set(parameterKey(parameter), parameter);
  }

  return Array.from(merged.values());
};

const parseRequestBody = (value: unknown): RequestBody | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const content = parseMediaTypeContent(value.content);
  if (Object.keys(content).length === 0) {
    return undefined;
  }

  return {
    required: value.required === true,
    description: typeof value.description === 'string' ? value.description : undefined,
    content,
  };
};

const parseResponseHeaders = (value: unknown): Record<string, ResponseHeader> | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const headers: Record<string, ResponseHeader> = {};

  for (const [name, headerValue] of Object.entries(value)) {
    if (!isRecord(headerValue)) {
      continue;
    }

    headers[name] = {
      description:
        typeof headerValue.description === 'string' ? headerValue.description : undefined,
      schema: isRecord(headerValue.schema) ? headerValue.schema : undefined,
      required: headerValue.required === true,
    };
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
};

const parseResponses = (value: unknown): ResponseObject[] => {
  if (!isRecord(value)) {
    return [];
  }

  return Object.entries(value).map(([statusCode, responseValue]) => {
    const response = isRecord(responseValue) ? responseValue : {};
    const content = parseMediaTypeContent(response.content);

    return {
      statusCode,
      description: typeof response.description === 'string' ? response.description : '',
      content: Object.keys(content).length > 0 ? content : undefined,
      headers: parseResponseHeaders(response.headers),
    };
  });
};

const parseSecurity = (value: unknown): SecurityRequirement[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const security = value.filter(isRecord) as SecurityRequirement[];
  return security.length > 0 ? security : undefined;
};

const parseTags = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [DEFAULT_OPERATION_TAG];
  }

  const tags = value.filter((tag): tag is string => typeof tag === 'string' && tag.length > 0);
  return tags.length > 0 ? tags : [DEFAULT_OPERATION_TAG];
};

const createOperationId = (
  method: HttpMethod,
  path: string,
  operationId: string | undefined
): string => {
  if (operationId) {
    return operationId;
  }

  return `${method}:${path}`;
};

const extractInfo = (spec: Record<string, unknown>): ApiInfo | null => {
  if (!isRecord(spec.info)) {
    return null;
  }

  if (typeof spec.info.title !== 'string' || typeof spec.info.version !== 'string') {
    return null;
  }

  return {
    title: spec.info.title,
    version: spec.info.version,
    description: typeof spec.info.description === 'string' ? spec.info.description : undefined,
  };
};

const extractServers = (spec: Record<string, unknown>): ApiServer[] => {
  if (!Array.isArray(spec.servers)) {
    return [];
  }

  return spec.servers.flatMap((server) => {
    if (!isRecord(server) || typeof server.url !== 'string') {
      return [];
    }

    return [
      {
        url: server.url,
        description: typeof server.description === 'string' ? server.description : undefined,
      },
    ];
  });
};

const extractTagDefinitions = (spec: Record<string, unknown>): TagDefinition[] => {
  if (!Array.isArray(spec.tags)) {
    return [];
  }

  return spec.tags.flatMap((tag) => {
    if (!isRecord(tag) || typeof tag.name !== 'string') {
      return [];
    }

    return [
      {
        name: tag.name,
        description: typeof tag.description === 'string' ? tag.description : undefined,
      },
    ];
  });
};

const extractOperations = (spec: Record<string, unknown>): Operation[] => {
  if (!isRecord(spec.paths)) {
    return [];
  }

  const operations: Operation[] = [];

  for (const [path, pathItemValue] of Object.entries(spec.paths)) {
    if (!isRecord(pathItemValue)) {
      continue;
    }

    const pathParameters = Array.isArray(pathItemValue.parameters)
      ? pathItemValue.parameters
          .map(parseParameter)
          .filter((parameter): parameter is OperationParameter => parameter !== null)
      : [];

    for (const [key, operationValue] of Object.entries(pathItemValue)) {
      if (NON_OPERATION_PATH_KEYS.has(key) || !isHttpMethod(key) || !isRecord(operationValue)) {
        continue;
      }

      const method = key;
      const operationParameters = Array.isArray(operationValue.parameters)
        ? operationValue.parameters
            .map(parseParameter)
            .filter((parameter): parameter is OperationParameter => parameter !== null)
        : [];

      operations.push({
        id: createOperationId(
          method,
          path,
          typeof operationValue.operationId === 'string' ? operationValue.operationId : undefined
        ),
        method,
        path,
        summary: typeof operationValue.summary === 'string' ? operationValue.summary : undefined,
        description:
          typeof operationValue.description === 'string' ? operationValue.description : undefined,
        operationId:
          typeof operationValue.operationId === 'string' ? operationValue.operationId : undefined,
        tags: parseTags(operationValue.tags),
        parameters: mergeParameters(pathParameters, operationParameters),
        requestBody: parseRequestBody(operationValue.requestBody),
        responses: parseResponses(operationValue.responses),
        security: parseSecurity(operationValue.security),
        deprecated: operationValue.deprecated === true,
      });
    }
  }

  return operations.sort(compareOperations);
};

export const groupOperationsByTag = (
  operations: Operation[],
  tagDefinitions: TagDefinition[]
): TagGroup[] => {
  const tagDescriptionByName = new Map(tagDefinitions.map((tag) => [tag.name, tag.description]));
  const tagOrder = [...tagDefinitions.map((tag) => tag.name)];
  const operationsByTag = new Map<string, Operation[]>();

  for (const operation of operations) {
    for (const tagName of operation.tags) {
      if (!operationsByTag.has(tagName)) {
        operationsByTag.set(tagName, []);
        if (!tagOrder.includes(tagName)) {
          tagOrder.push(tagName);
        }
      }

      operationsByTag.get(tagName)?.push(operation);
    }
  }

  return tagOrder
    .filter((tagName) => operationsByTag.has(tagName))
    .map((tagName) => ({
      name: tagName,
      description: tagDescriptionByName.get(tagName),
      operations: (operationsByTag.get(tagName) ?? []).sort(compareOperations),
    }));
};

export const extractEndpoints = (
  spec: Record<string, unknown> | null
): ExtractedEndpoints | null => {
  if (!spec) {
    return null;
  }

  const info = extractInfo(spec);
  if (!info) {
    return null;
  }

  const tags = extractTagDefinitions(spec);
  const operations = extractOperations(spec);
  const tagGroups = groupOperationsByTag(operations, tags);

  return {
    info,
    servers: extractServers(spec),
    tags,
    tagGroups,
    operations,
  };
};

const readFirstServerUrl = (servers: ApiServer[]): string | null => {
  for (const server of servers) {
    const url = server.url?.trim();
    if (url) {
      return url;
    }
  }

  return null;
};

/**
 * Returns the first server base URL for Viewer display / request building.
 * Accepts extracted endpoints, a servers list, or a raw OpenAPI object.
 */
export const getServerUrl = (
  source: ExtractedEndpoints | ApiServer[] | Record<string, unknown> | null | undefined
): string | null => {
  if (!source) {
    return null;
  }

  if (Array.isArray(source)) {
    return readFirstServerUrl(source);
  }

  if ('servers' in source) {
    if (Array.isArray(source.servers)) {
      // ExtractedEndpoints.servers is ApiServer[]; raw specs may be untyped arrays.
      const servers = source.servers.filter(
        (server): server is ApiServer => isRecord(server) && typeof server.url === 'string'
      );

      return readFirstServerUrl(servers);
    }
  }

  return null;
};
