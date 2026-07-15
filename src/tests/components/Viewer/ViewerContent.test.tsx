import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ViewerContent } from '@/components/Viewer/ViewerContent';
import type { ExtractedEndpoints } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      emptySchemaTitle: 'No schema to preview',
      emptySchema: 'Paste a schema.',
      invalidSchemaTitle: 'Schema is invalid',
      invalidSchema: 'Fix errors.',
      invalidSchemaHint: 'See editor.',
      baseUrl: 'Base URL',
      baseUrlLinkLabel: 'Open base URL {url} in a new tab',
      noBaseUrl: 'No server URL defined in this schema.',
      noDescription: 'No description provided.',
      versionLabel: 'Version {version}',
      endpointsLabel: 'API endpoints',
      emptyEndpoints: 'No endpoints found in this schema.',
      requiresAuth: 'Requires authentication',
      tagGroupLabel: '{name} tag group',
      operationsCount: '{count} operations',
      expandEndpoint: 'Show endpoint details for {method} {path}',
      collapseEndpoint: 'Hide endpoint details for {method} {path}',
      tryItOut: 'Try it out',
      cancelTryItOut: 'Cancel',
      tryItOutPanel: 'Try it out request form',
      tryItOutPlaceholder: 'Parameter and body inputs will appear here.',
      tryItOutParametersTitle: 'Parameters',
      tryItOutParametersEmpty: 'This endpoint has no parameters to fill.',
      tryItOutRequired: 'required',
      tryItOutUnset: '—',
      tryItOutBooleanTrue: 'true',
      tryItOutBooleanFalse: 'false',
      tryItOutArrayHint: 'Enter a JSON array, e.g. ["a", "b"]',
      tryItOutObjectHint: 'Enter a JSON object, e.g. {"key": "value"}',
      parametersTitle: 'Parameters',
      parametersEmpty: 'This endpoint has no parameters.',
      parametersPath: 'Path',
      parametersQuery: 'Query',
      parametersHeader: 'Header',
      parametersCookie: 'Cookie',
      parameterName: 'Name',
      parameterType: 'Type',
      parameterRequired: 'Required',
      parameterRequiredYes: 'Yes',
      parameterRequiredNo: 'No',
      parameterDescription: 'Description',
      parameterNoDescription: '—',
      parameterExample: 'Example',
      deprecated: 'Deprecated',
      requestBodyTitle: 'Request body',
      requestBodyEmpty: 'No body',
      requestBodyRequired: 'Required',
      requestBodyOptional: 'Optional',
      requestBodyContentType: 'Content type',
      requestBodySchema: 'Schema',
      requestBodyExample: 'Example',
      requestBodyNoExample: 'No example',
      responsesTitle: 'Responses',
      responsesEmpty: 'No responses',
      responseNoDescription: 'No description',
      responseContentType: 'Content type',
      responseSchema: 'Schema',
      responseExample: 'Example',
      responseNoExample: 'No example',
      responseNoSchema: 'No schema',
      responseNoContent: 'No content',
      responseHeaders: 'Headers',
      schemaEmpty: 'No schema',
      schemaRequired: 'required',
      schemaOptional: 'optional',
      schemaEnum: 'Enum',
      schemaItems: 'Items',
      schemaAllOf: 'allOf',
      schemaAnyOf: 'anyOf',
      schemaOneOf: 'oneOf',
    },
  }),
}));

const extracted: ExtractedEndpoints = {
  info: { title: 'Pet Store API', version: '1.0.0', description: 'Demo' },
  servers: [{ url: 'https://api.example.com' }],
  tags: [],
  tagGroups: [],
  operations: [],
  document: { openapi: '3.0.3' },
};

describe('ViewerContent', () => {
  it('shows empty state when schema is missing', () => {
    render(<ViewerContent extracted={null} schemaState="empty" />);

    expect(screen.getByText('No schema to preview')).toBeInTheDocument();
  });

  it('shows invalid state with errors', () => {
    render(
      <ViewerContent extracted={null} schemaState="invalid" validationErrors={['Broken YAML']} />
    );

    expect(screen.getByText('Schema is invalid')).toBeInTheDocument();
    expect(screen.getByText('Broken YAML')).toBeInTheDocument();
  });

  it('renders header and endpoints for a ready schema', () => {
    render(<ViewerContent extracted={extracted} schemaState="ready" />);

    expect(screen.getByText('Pet Store API')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('No endpoints found in this schema.')).toBeInTheDocument();
  });
});
