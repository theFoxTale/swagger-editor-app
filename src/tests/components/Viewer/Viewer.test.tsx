import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Viewer } from '@/components/Viewer/Viewer';
import { DEFAULT_SCHEMA, validateSchema } from '@/lib/openapi';

const parsedSpec = validateSchema(DEFAULT_SCHEMA).parsed;

type MockEditorTab = {
  id: string;
  content: string;
  parsedSpec: Record<string, unknown> | null;
  isValid: boolean;
  validationErrors: string[];
};

type MockEditorState = {
  tabs: MockEditorTab[];
  activeTabId: string;
};

const createEditorState = (overrides: Partial<MockEditorTab> = {}): MockEditorState => ({
  tabs: [
    {
      id: 'tab-1',
      content: DEFAULT_SCHEMA,
      parsedSpec,
      isValid: true,
      validationErrors: [],
      ...overrides,
    },
  ],
  activeTabId: 'tab-1',
});

let editorState: MockEditorState = createEditorState();

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      title: 'Viewer',
      emptySchemaTitle: 'No schema to preview',
      emptySchema: 'Paste a schema.',
      invalidSchemaTitle: 'Schema is invalid',
      invalidSchema: 'Fix errors.',
      invalidSchemaHint: 'See editor.',
      requiresAuth: 'Requires authentication',
      tagGroupLabel: '{name} tag group',
      operationsCount: '{count} operations',
      expandEndpoint: 'Show endpoint details for {method} {path}',
      collapseEndpoint: 'Hide endpoint details for {method} {path}',
      baseUrl: 'Base URL',
      baseUrlLinkLabel: 'Open base URL {url} in a new tab',
      noBaseUrl: 'No server URL defined in this schema.',
      noDescription: 'No description provided.',
      versionLabel: 'Version {version}',
      endpointsLabel: 'API endpoints',
      emptyEndpoints: 'No endpoints found in this schema.',
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
      tryItOutHeadersTitle: 'Headers',
      tryItOutHeaderName: 'Name',
      tryItOutHeaderValue: 'Value',
      tryItOutAddHeader: 'Add header',
      tryItOutRemoveHeader: 'Remove',
      tryItOutCustomHeader: 'Custom header',
      tryItOutAcceptPlaceholder: 'application/json',
      tryItOutAuthorizationPlaceholder: 'Bearer <token>',
      tryItOutBodyTitle: 'Request body',
      tryItOutBodyEmpty: 'This endpoint has no request body.',
      tryItOutBodyContentType: 'Request body content type',
      tryItOutBodyEditor: 'Request body editor',
      tryItOutBodyInvalidJson: 'Body is not valid JSON.',
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

vi.mock('@/store', () => ({
  getActiveTab: (state: MockEditorState) =>
    state.tabs.find((tab) => tab.id === state.activeTabId) ?? state.tabs[0],
  useEditorStore: (selector: (state: MockEditorState) => unknown) => selector(editorState),
}));

describe('Viewer', () => {
  beforeEach(() => {
    editorState = createEditorState();
  });

  it('renders endpoints from a valid schema in the editor store', () => {
    render(<Viewer />);

    expect(screen.getByRole('region', { name: 'Viewer' })).toBeInTheDocument();
    expect(screen.getByText('Pet Store API')).toBeInTheDocument();
    expect(screen.getByText('pet')).toBeInTheDocument();
    expect(screen.getByText('List all pets')).toBeInTheDocument();
    expect(screen.getByLabelText('5 operations')).toBeInTheDocument();
  });

  it('shows empty state when schema content is blank', () => {
    editorState = createEditorState({
      content: '',
      parsedSpec: null,
      isValid: false,
      validationErrors: [],
    });

    render(<Viewer />);

    expect(screen.queryByText('Pet Store API')).not.toBeInTheDocument();
    expect(screen.getByText('No schema to preview')).toBeInTheDocument();
  });
});
