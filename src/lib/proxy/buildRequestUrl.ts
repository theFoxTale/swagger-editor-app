import {
  getParameterKey,
  type ParameterValues,
} from '@/components/Viewer/TryItOutParameterInputs/parameterInputUtils';
import type { OperationParameter } from '@/lib/openapi';

export interface BuildRequestUrlInput {
  serverUrl: string;
  path: string;
  values: ParameterValues;
  parameters?: OperationParameter[];
  origin?: string;
}

export type BuildRequestUrlResult = { ok: true; url: string } | { ok: false; error: string };

const PATH_PARAM_PATTERN = /\{([^/}]+)\}/g;

export const joinServerAndPath = (serverUrl: string, pathTemplate: string): string => {
  const base = serverUrl.trim().replace(/\/+$/, '');
  const path = pathTemplate.trim().startsWith('/')
    ? pathTemplate.trim()
    : `/${pathTemplate.trim()}`;

  return `${base}${path}`;
};

export const resolveServerUrl = (serverUrl: string, origin?: string): string | null => {
  const trimmed = serverUrl.trim();
  if (!trimmed) {
    return null;
  }

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      return new URL(trimmed).toString().replace(/\/+$/, '');
    }

    if (trimmed.startsWith('/') && origin) {
      return new URL(trimmed, origin).toString().replace(/\/+$/, '');
    }
  } catch {
    return null;
  }

  return null;
};

const fillPathTemplate = (
  pathTemplate: string,
  values: ParameterValues
): { path: string; missing: string[] } => {
  const missing: string[] = [];

  const path = pathTemplate.replace(PATH_PARAM_PATTERN, (_match, name: string) => {
    const value = values[`path:${name}`]?.trim() ?? '';

    if (!value) {
      missing.push(name);
      return `{${name}}`;
    }

    return encodeURIComponent(value);
  });

  return { path, missing };
};

const collectQueryEntries = (
  values: ParameterValues,
  parameters: OperationParameter[] | undefined
): Array<[string, string]> => {
  if (parameters && parameters.length > 0) {
    return parameters
      .filter((parameter) => parameter.in === 'query')
      .map((parameter) => {
        const value = values[getParameterKey(parameter)]?.trim() ?? '';
        return [parameter.name, value] as [string, string];
      })
      .filter(([, value]) => value.length > 0);
  }

  return Object.entries(values)
    .filter(([key, value]) => key.startsWith('query:') && value.trim().length > 0)
    .map(([key, value]) => [key.slice('query:'.length), value.trim()]);
};

export const buildRequestUrl = ({
  serverUrl,
  path,
  values,
  parameters,
  origin,
}: BuildRequestUrlInput): BuildRequestUrlResult => {
  const resolvedServer = resolveServerUrl(serverUrl, origin);
  if (!resolvedServer) {
    return {
      ok: false,
      error: origin
        ? 'Server URL must be an absolute http(s) URL or a path relative to the page origin.'
        : 'Server URL must be an absolute http(s) URL.',
    };
  }

  if (parameters) {
    for (const parameter of parameters) {
      if (parameter.in !== 'path' || !parameter.required) {
        continue;
      }
      const value = values[getParameterKey(parameter)]?.trim() ?? '';
      if (!value) {
        return {
          ok: false,
          error: `Missing required path parameter: ${parameter.name}.`,
        };
      }
    }
  }

  const { path: filledPath, missing } = fillPathTemplate(path, values);
  if (missing.length > 0) {
    return {
      ok: false,
      error: `Missing path parameter${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.`,
    };
  }

  let url: URL;
  try {
    url = new URL(joinServerAndPath(resolvedServer, filledPath));
  } catch {
    return { ok: false, error: 'Failed to build request URL.' };
  }

  for (const [name, value] of collectQueryEntries(values, parameters)) {
    url.searchParams.append(name, value);
  }

  return { ok: true, url: url.toString() };
};
