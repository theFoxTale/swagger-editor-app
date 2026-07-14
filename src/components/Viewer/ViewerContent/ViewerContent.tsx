'use client';

import { getServerUrl, type ExtractedEndpoints } from '@/lib/openapi';

import { EndpointList } from '../EndpointList';
import { ViewerEmptyState, type ViewerSchemaState } from '../ViewerEmptyState';
import { ViewerHeader } from '../ViewerHeader';

export interface ViewerContentProps {
  extracted: ExtractedEndpoints | null;
  schemaState: ViewerSchemaState | 'ready';
  validationErrors?: string[];
}

export const ViewerContent = ({
  extracted,
  schemaState,
  validationErrors = [],
}: ViewerContentProps) => {
  if (schemaState !== 'ready' || !extracted) {
    return (
      <ViewerEmptyState
        state={schemaState === 'ready' ? 'empty' : schemaState}
        validationErrors={validationErrors}
      />
    );
  }

  const serverUrl = getServerUrl(extracted);

  return (
    <>
      <ViewerHeader
        title={extracted.info.title}
        version={extracted.info.version}
        description={extracted.info.description}
        serverUrl={serverUrl}
      />
      <EndpointList tagGroups={extracted.tagGroups} document={extracted.document} />
    </>
  );
};
