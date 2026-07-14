'use client';

import { useState } from 'react';

import { useTranslation } from '@/hooks';
import type { TagGroup as TagGroupData } from '@/lib/openapi';

import { EndpointParameters } from '../EndpointParameters';
import { EndpointRequestBody } from '../EndpointRequestBody';
import { EndpointResponses } from '../EndpointResponses';
import { TagGroup } from '../TagGroup';
import styles from './EndpointList.module.css';

export interface EndpointListProps {
  tagGroups: TagGroupData[];
}

export const EndpointList = ({ tagGroups }: EndpointListProps) => {
  const { viewerLang } = useTranslation();
  const [expandedOperationId, setExpandedOperationId] = useState<string | null>(null);

  const handleToggleOperation = (operationId: string) => {
    setExpandedOperationId((current) => (current === operationId ? null : operationId));
  };

  if (tagGroups.length === 0) {
    return <p className={styles.empty}>{viewerLang.emptyEndpoints}</p>;
  }

  return (
    <div className={styles.list} role="list" aria-label={viewerLang.endpointsLabel}>
      {tagGroups.map((group, index) => (
        <div key={group.name} className={styles.item} role="listitem">
          <TagGroup
            group={group}
            defaultOpen={index === 0}
            expandedOperationId={expandedOperationId}
            onToggleOperation={handleToggleOperation}
            renderDetails={(operation) => (
              <>
                <EndpointParameters parameters={operation.parameters} />
                <EndpointRequestBody
                  key={`${operation.id}-body`}
                  requestBody={operation.requestBody}
                />
                <EndpointResponses
                  key={`${operation.id}-responses`}
                  responses={operation.responses}
                />
              </>
            )}
          />
        </div>
      ))}
    </div>
  );
};
