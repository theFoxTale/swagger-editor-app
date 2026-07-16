import type { ProxySuccessResponse } from '@/lib/proxy';

export const formatResponseBody = (body: string, contentType?: string): string => {
  const trimmed = body.trim();
  if (!trimmed) {
    return '';
  }

  const looksJson =
    (contentType && /json/i.test(contentType)) ||
    trimmed.startsWith('{') ||
    trimmed.startsWith('[');

  if (!looksJson) {
    return body;
  }

  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return body;
  }
};

export const getResponseContentType = (response: ProxySuccessResponse): string | undefined => {
  const entry = Object.entries(response.headers).find(
    ([name]) => name.toLowerCase() === 'content-type'
  );
  return entry?.[1];
};

export const formatDuration = (durationMs: number): string => `${Math.max(0, durationMs)}ms`;
