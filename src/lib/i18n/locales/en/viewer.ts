import type { ViewerTranslation } from '../../types';

export const viewer: ViewerTranslation = {
  title: 'Viewer',
  emptySchema: 'Load a valid OpenAPI schema in the editor to preview endpoints.',
  baseUrl: 'Base URL',
  endpointsLabel: 'API endpoints',
  emptyEndpoints: 'No endpoints found in this schema.',
  requiresAuth: 'Requires authentication',
  tagGroupLabel: '{name} tag group',
  operationsCount: '{count} operations',
  expandEndpoint: 'Show endpoint details for {method} {path}',
  collapseEndpoint: 'Hide endpoint details for {method} {path}',
};
