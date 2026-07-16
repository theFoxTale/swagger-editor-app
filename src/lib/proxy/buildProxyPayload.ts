import { getParameterKey } from '@/components/Viewer/TryItOutParameterInputs/parameterInputUtils';
import type { TryItOutStateSnapshot } from '@/hooks/useTryItOutState';
import type { Operation } from '@/lib/openapi';

import { buildRequestUrl } from './buildRequestUrl';
import { methodsWithoutBody } from './forwardRequest';
import type { ProxyRequestPayload } from './types';

export type BuildProxyPayloadResult =
  { ok: true; payload: ProxyRequestPayload } | { ok: false; error: string };

export interface BuildProxyPayloadInput {
  operation: Operation;
  serverUrl: string;
  snapshot: TryItOutStateSnapshot;
  origin?: string;
}

const findHeaderName = (headers: Record<string, string>, name: string): string | undefined =>
  Object.keys(headers).find((key) => key.toLowerCase() === name.toLowerCase());

export const mergeRequestHeaders = ({
  operation,
  snapshot,
}: {
  operation: Operation;
  snapshot: TryItOutStateSnapshot;
}): Record<string, string> => {
  const headers: Record<string, string> = { ...snapshot.headers };

  for (const parameter of operation.parameters) {
    if (parameter.in !== 'header') {
      continue;
    }

    const value = snapshot.parameters[getParameterKey(parameter)]?.trim() ?? '';
    if (!value) {
      continue;
    }

    headers[parameter.name] = value;
  }

  const cookieParts = operation.parameters
    .filter((parameter) => parameter.in === 'cookie')
    .map((parameter) => {
      const value = snapshot.parameters[getParameterKey(parameter)]?.trim() ?? '';
      if (!value) {
        return null;
      }
      return `${parameter.name}=${value}`;
    })
    .filter((part): part is string => part !== null);

  if (cookieParts.length > 0) {
    const existingCookieKey = findHeaderName(headers, 'Cookie');
    const existingCookie = existingCookieKey ? headers[existingCookieKey]?.trim() : '';
    const merged = [existingCookie, ...cookieParts].filter(Boolean).join('; ');
    if (existingCookieKey) {
      headers[existingCookieKey] = merged;
    } else {
      headers.Cookie = merged;
    }
  }

  const method = operation.method.toLowerCase();
  const includeBody =
    Boolean(snapshot.body?.trim()) &&
    !methodsWithoutBody.has(method) &&
    Boolean(snapshot.contentType);

  if (includeBody && snapshot.contentType && !findHeaderName(headers, 'Content-Type')) {
    headers['Content-Type'] = snapshot.contentType;
  }

  return headers;
};

export const buildProxyPayload = ({
  operation,
  serverUrl,
  snapshot,
  origin,
}: BuildProxyPayloadInput): BuildProxyPayloadResult => {
  const urlResult = buildRequestUrl({
    serverUrl,
    path: operation.path,
    values: snapshot.parameters,
    parameters: operation.parameters,
    origin,
  });

  if (!urlResult.ok) {
    return urlResult;
  }

  const method = operation.method.toLowerCase();
  const includeBody = !methodsWithoutBody.has(method) && Boolean(snapshot.body?.trim());

  return {
    ok: true,
    payload: {
      method,
      url: urlResult.url,
      headers: mergeRequestHeaders({ operation, snapshot }),
      body: includeBody ? snapshot.body : null,
    },
  };
};
