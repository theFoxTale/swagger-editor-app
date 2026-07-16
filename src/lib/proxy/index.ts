export type {
  ProxyErrorResponse,
  ProxyRequestPayload,
  ProxyResponse,
  ProxySuccessResponse,
} from './types';
export { HOP_BY_HOP_HEADERS, isHttpMethod, isProxyTransportError } from './types';
export { isAllowedProxyUrl, validateProxyRequest } from './validateProxyRequest';
export {
  buildRequestUrl,
  joinServerAndPath,
  resolveServerUrl,
  type BuildRequestUrlInput,
  type BuildRequestUrlResult,
} from './buildRequestUrl';
export {
  buildProxyPayload,
  mergeRequestHeaders,
  type BuildProxyPayloadInput,
  type BuildProxyPayloadResult,
} from './buildProxyPayload';

export { generateCurl } from './generateCurl';
export { executeProxyRequest, PROXY_API_PATH } from './executeProxyRequest';
export {
  classifyProxyTransportError,
  getProxyTransportErrorDetail,
  getUpstreamErrorMessage,
  type ProxyTransportErrorKind,
} from './formatTransportError';

export {
  forwardRequest,
  headersToRecord,
  methodsWithoutBody,
  sanitizeOutboundHeaders,
} from './forwardRequest';
