import { isHttpMethod, type ProxyRequestPayload } from './types';

export type ProxyValidationResult =
  | {
      valid: true;
      payload: Required<Pick<ProxyRequestPayload, 'method' | 'url'>> & ProxyRequestPayload;
    }
  | { valid: false; error: string };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isAllowedProxyUrl = (urlString: string): boolean => {
  let parsed: URL;

  try {
    parsed = new URL(urlString);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return false;
  }

  if (!parsed.hostname) {
    return false;
  }

  return true;
};

export const validateProxyRequest = (input: unknown): ProxyValidationResult => {
  if (!isPlainObject(input)) {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const method = typeof input.method === 'string' ? input.method.trim() : '';
  const url = typeof input.url === 'string' ? input.url.trim() : '';

  if (!method) {
    return { valid: false, error: 'Field "method" is required.' };
  }

  if (!isHttpMethod(method)) {
    return { valid: false, error: `Unsupported HTTP method: ${method}.` };
  }

  if (!url) {
    return { valid: false, error: 'Field "url" is required.' };
  }

  if (!isAllowedProxyUrl(url)) {
    return {
      valid: false,
      error: 'Field "url" must be an absolute http or https URL.',
    };
  }

  let headers: Record<string, string> | undefined;
  if (input.headers !== undefined) {
    if (!isPlainObject(input.headers)) {
      return { valid: false, error: 'Field "headers" must be an object.' };
    }

    headers = {};
    for (const [key, value] of Object.entries(input.headers)) {
      if (typeof value !== 'string') {
        return { valid: false, error: `Header "${key}" must be a string.` };
      }
      headers[key] = value;
    }
  }

  let body: string | null | undefined;
  if (input.body === null || input.body === undefined) {
    body = input.body === null ? null : undefined;
  } else if (typeof input.body === 'string') {
    body = input.body;
  } else {
    return { valid: false, error: 'Field "body" must be a string or null.' };
  }

  return {
    valid: true,
    payload: {
      method: method.toLowerCase(),
      url,
      headers,
      body,
    },
  };
};
