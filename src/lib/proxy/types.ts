import type { HttpMethod } from '@/lib/openapi';
import { HTTP_METHODS } from '@/lib/openapi';

export interface ProxyRequestPayload {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string | null;
}

export interface ProxySuccessResponse {
  ok: true;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
}

export interface ProxyErrorResponse {
  ok: false;
  error: string;
}

export type ProxyResponse = ProxySuccessResponse | ProxyErrorResponse;

export const isHttpMethod = (value: string): value is HttpMethod =>
  (HTTP_METHODS as readonly string[]).includes(value.toLowerCase());

/** Headers that must not be forwarded from the browser to the upstream API. */
export const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
  'cookie',
]);
