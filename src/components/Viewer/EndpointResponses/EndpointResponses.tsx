'use client';

import { useState } from 'react';

import { useTranslation } from '@/hooks';
import type { ResponseObject } from '@/lib/openapi';

import {
  formatJsonValue,
  getMediaTypeContentTypes,
  getMediaTypeExample,
  getResolvedSchema,
  getResponseStatusTone,
  getSchemaTypeLabel,
  sortResponses,
} from '../schemaUtils';
import styles from './EndpointResponses.module.css';

export interface EndpointResponsesProps {
  responses: ResponseObject[];
  document?: Record<string, unknown> | null;
}

const STATUS_TONE_CLASS = {
  info: styles.statusInfo,
  success: styles.statusSuccess,
  redirect: styles.statusRedirect,
  clientError: styles.statusClientError,
  serverError: styles.statusServerError,
  default: styles.statusDefault,
} as const;

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ResponseItem = ({
  response,
  document = null,
  defaultOpen = false,
}: {
  response: ResponseObject;
  document?: Record<string, unknown> | null;
  defaultOpen?: boolean;
}) => {
  const { viewerLang } = useTranslation();
  const contentTypes = getMediaTypeContentTypes(response.content);
  const [selectedContentType, setSelectedContentType] = useState(contentTypes[0] ?? '');
  const [open, setOpen] = useState(defaultOpen);

  const activeContentType = contentTypes.includes(selectedContentType)
    ? selectedContentType
    : contentTypes[0];
  const mediaType =
    activeContentType && response.content ? response.content[activeContentType] : undefined;
  const resolvedSchema = getResolvedSchema(mediaType?.schema, document);
  const schemaLabel = getSchemaTypeLabel(mediaType?.schema);
  const schemaJson = resolvedSchema ? formatJsonValue(resolvedSchema, true) : null;
  const exampleJson = formatJsonValue(getMediaTypeExample(mediaType ?? {}, document), true);
  const headerEntries = Object.entries(response.headers ?? {});
  const toneClass = STATUS_TONE_CLASS[getResponseStatusTone(response.statusCode)];

  return (
    <article className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
      <button
        type="button"
        className={styles.itemHeader}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className={`${styles.status} ${toneClass}`}>{response.statusCode}</span>
        <span className={styles.itemDescription}>
          {response.description || viewerLang.responseNoDescription}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          <ChevronIcon />
        </span>
      </button>

      {open ? (
        <div className={styles.itemBody}>
          {contentTypes.length > 0 ? (
            <>
              <div
                className={styles.contentTypes}
                role="tablist"
                aria-label={viewerLang.responseContentType}
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
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedContentType(contentType);
                      }}
                    >
                      {contentType}
                    </button>
                  );
                })}
              </div>

              <div className={styles.block}>
                <div className={styles.blockHeader}>
                  <h4 className={styles.blockTitle}>{viewerLang.responseSchema}</h4>
                  <code className={styles.schemaType}>{schemaLabel}</code>
                </div>
                {schemaJson ? (
                  <pre className={styles.code}>{schemaJson}</pre>
                ) : (
                  <p className={styles.emptyInline}>{viewerLang.responseNoSchema}</p>
                )}
              </div>

              <div className={styles.block}>
                <h4 className={styles.blockTitle}>{viewerLang.responseExample}</h4>
                {exampleJson ? (
                  <pre className={styles.code}>{exampleJson}</pre>
                ) : (
                  <p className={styles.emptyInline}>{viewerLang.responseNoExample}</p>
                )}
              </div>
            </>
          ) : (
            <p className={styles.emptyInline}>{viewerLang.responseNoContent}</p>
          )}

          {headerEntries.length > 0 ? (
            <div className={styles.block}>
              <h4 className={styles.blockTitle}>{viewerLang.responseHeaders}</h4>
              <ul className={styles.headerList}>
                {headerEntries.map(([name, header]) => (
                  <li key={name} className={styles.headerItem}>
                    <code className={styles.headerName}>{name}</code>
                    <span className={styles.headerMeta}>
                      {getSchemaTypeLabel(
                        getResolvedSchema(header.schema, document) ?? header.schema
                      )}
                      {header.required ? ` · ${viewerLang.parameterRequiredYes}` : ''}
                    </span>
                    {header.description ? (
                      <span className={styles.headerDescription}>{header.description}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

export const EndpointResponses = ({ responses, document = null }: EndpointResponsesProps) => {
  const { viewerLang } = useTranslation();

  if (responses.length === 0) {
    return <p className={styles.empty}>{viewerLang.responsesEmpty}</p>;
  }

  const sorted = sortResponses(responses);

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>
        {viewerLang.responsesTitle}
        <span className={styles.count}>{sorted.length}</span>
      </h3>

      <div className={styles.list}>
        {sorted.map((response, index) => (
          <ResponseItem
            key={response.statusCode}
            response={response}
            document={document}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </div>
  );
};
