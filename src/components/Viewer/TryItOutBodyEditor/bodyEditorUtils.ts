import type { RequestBody } from '@/lib/openapi';

import { formatJsonValue, getMediaTypeExample, getRequestBodyContentTypes } from '../schemaUtils';

export const getInitialRequestBodyText = (
  requestBody: RequestBody | undefined,
  contentType: string,
  document?: Record<string, unknown> | null
): string => {
  if (!requestBody || !contentType) {
    return '';
  }

  const mediaType = requestBody.content[contentType];
  if (!mediaType) {
    return '';
  }

  return formatJsonValue(getMediaTypeExample(mediaType, document), true) ?? '';
};

export const getDefaultRequestBodyContentType = (requestBody: RequestBody | undefined): string => {
  if (!requestBody) {
    return '';
  }

  const contentTypes = getRequestBodyContentTypes(requestBody);
  return contentTypes[0] ?? '';
};

export const isJsonContentType = (contentType: string): boolean =>
  /json/i.test(contentType) || contentType.includes('+json');

export const isValidJsonText = (text: string): boolean => {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return true;
  }

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
};
