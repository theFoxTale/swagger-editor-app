'use client';

import { useState, type ChangeEvent } from 'react';

import { useTranslation } from '@/hooks';
import type { RequestBody } from '@/lib/openapi';

import { getRequestBodyContentTypes } from '../schemaUtils';
import {
  getDefaultRequestBodyContentType,
  getInitialRequestBodyText,
  isJsonContentType,
  isValidJsonText,
} from './bodyEditorUtils';
import styles from './TryItOutBodyEditor.module.css';

export interface TryItOutBodyEditorProps {
  requestBody?: RequestBody;
  document?: Record<string, unknown> | null;
  contentType?: string;
  body?: string;
  onContentTypeChange?: (contentType: string) => void;
  onBodyChange?: (body: string) => void;
}

export {
  getDefaultRequestBodyContentType,
  getInitialRequestBodyText,
  isJsonContentType,
  isValidJsonText,
} from './bodyEditorUtils';

export const TryItOutBodyEditor = ({
  requestBody,
  document = null,
  contentType: contentTypeProp,
  body: bodyProp,
  onContentTypeChange,
  onBodyChange,
}: TryItOutBodyEditorProps) => {
  const { viewerLang } = useTranslation();
  const contentTypes = requestBody ? getRequestBodyContentTypes(requestBody) : [];

  const [uncontrolledContentType, setUncontrolledContentType] = useState(() =>
    getDefaultRequestBodyContentType(requestBody)
  );
  const [uncontrolledBody, setUncontrolledBody] = useState(() =>
    getInitialRequestBodyText(requestBody, getDefaultRequestBodyContentType(requestBody), document)
  );

  if (!requestBody || contentTypes.length === 0) {
    return <p className={styles.empty}>{viewerLang.tryItOutBodyEmpty}</p>;
  }

  const isContentTypeControlled = contentTypeProp !== undefined;
  const isBodyControlled = bodyProp !== undefined;

  const contentType = isContentTypeControlled
    ? contentTypes.includes(contentTypeProp)
      ? contentTypeProp
      : contentTypes[0]
    : contentTypes.includes(uncontrolledContentType)
      ? uncontrolledContentType
      : contentTypes[0];

  const body = isBodyControlled ? bodyProp : uncontrolledBody;
  const showJsonError = isJsonContentType(contentType) && !isValidJsonText(body);

  const setContentType = (next: string) => {
    if (!isContentTypeControlled) {
      setUncontrolledContentType(next);
    }
    onContentTypeChange?.(next);

    const nextBody = getInitialRequestBodyText(requestBody, next, document);
    if (!isBodyControlled) {
      setUncontrolledBody(nextBody);
    }
    onBodyChange?.(nextBody);
  };

  const setBody = (next: string) => {
    if (!isBodyControlled) {
      setUncontrolledBody(next);
    }
    onBodyChange?.(next);
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{viewerLang.tryItOutBodyTitle}</h3>
        {requestBody.required ? (
          <span className={styles.required}>{viewerLang.tryItOutRequired}</span>
        ) : (
          <span className={styles.optional}>{viewerLang.requestBodyOptional}</span>
        )}
      </div>

      {contentTypes.length > 1 ? (
        <div
          className={styles.contentTypes}
          role="tablist"
          aria-label={viewerLang.tryItOutBodyContentType}
        >
          {contentTypes.map((type) => {
            const selected = type === contentType;

            return (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`${styles.contentType} ${selected ? styles.contentTypeActive : ''}`}
                onClick={() => setContentType(type)}
              >
                {type}
              </button>
            );
          })}
        </div>
      ) : (
        <p className={styles.singleType}>
          <code>{contentType}</code>
        </p>
      )}

      <textarea
        className={`${styles.editor} ${showJsonError ? styles.editorInvalid : ''}`.trim()}
        value={body}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setBody(event.target.value)}
        spellCheck={false}
        rows={10}
        aria-label={viewerLang.tryItOutBodyEditor}
        aria-invalid={showJsonError || undefined}
      />

      {showJsonError ? <p className={styles.error}>{viewerLang.tryItOutBodyInvalidJson}</p> : null}
    </div>
  );
};
