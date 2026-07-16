'use client';

import { useState } from 'react';

import { useTranslation } from '@/hooks';
import type { RequestBody } from '@/lib/openapi';

import { SchemaRenderer } from '../SchemaRenderer';
import {
  formatJsonValue,
  getMediaTypeExample,
  getRequestBodyContentTypes,
  getResolvedSchema,
  getSchemaTypeLabel,
} from '../schemaUtils';
import styles from './EndpointRequestBody.module.css';

export interface EndpointRequestBodyProps {
  requestBody?: RequestBody;
  document?: Record<string, unknown> | null;
}

export const EndpointRequestBody = ({ requestBody, document = null }: EndpointRequestBodyProps) => {
  const { viewerLang } = useTranslation();
  const contentTypes = requestBody ? getRequestBodyContentTypes(requestBody) : [];
  const [selectedContentType, setSelectedContentType] = useState(contentTypes[0] ?? '');

  if (!requestBody || contentTypes.length === 0) {
    return <p className={styles.empty}>{viewerLang.requestBodyEmpty}</p>;
  }

  const activeContentType = contentTypes.includes(selectedContentType)
    ? selectedContentType
    : contentTypes[0];
  const mediaType = requestBody.content[activeContentType];
  const resolvedSchema = getResolvedSchema(mediaType?.schema, document);
  const schemaLabel = getSchemaTypeLabel(mediaType?.schema);
  const exampleJson = formatJsonValue(getMediaTypeExample(mediaType ?? {}, document), true);

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{viewerLang.requestBodyTitle}</h3>
        {requestBody.required ? (
          <span className={styles.required}>{viewerLang.requestBodyRequired}</span>
        ) : (
          <span className={styles.optional}>{viewerLang.requestBodyOptional}</span>
        )}
      </div>

      {requestBody.description ? (
        <p className={styles.description}>{requestBody.description}</p>
      ) : null}

      <div
        className={styles.contentTypes}
        role="tablist"
        aria-label={viewerLang.requestBodyContentType}
      >
        {contentTypes.map((contentType) => {
          const selected = contentType === activeContentType;

          return (
            <button
              key={contentType}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`${styles.contentType} ${selected ? styles.contentTypeActive : ''}`}
              onClick={() => setSelectedContentType(contentType)}
            >
              {contentType}
            </button>
          );
        })}
      </div>

      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <h4 className={styles.blockTitle}>{viewerLang.requestBodySchema}</h4>
          <code className={styles.schemaType}>{schemaLabel}</code>
        </div>
        <div className={styles.schemaBody}>
          <SchemaRenderer schema={resolvedSchema} />
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>{viewerLang.requestBodyExample}</h4>
        {exampleJson ? (
          <pre className={styles.code}>{exampleJson}</pre>
        ) : (
          <p className={styles.emptyInline}>{viewerLang.requestBodyNoExample}</p>
        )}
      </div>
    </div>
  );
};
