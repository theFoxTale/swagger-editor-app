'use client';

import { useState, type ChangeEvent } from 'react';

import { Button } from '@/components/common';
import { useTranslation } from '@/hooks';

import { createCustomHeader, createDefaultHeaders, type HeaderEntry } from './headersEditorUtils';
import styles from './TryItOutHeadersEditor.module.css';

export interface TryItOutHeadersEditorProps {
  headers?: HeaderEntry[];
  onHeadersChange?: (headers: HeaderEntry[]) => void;
}

export {
  createCustomHeader,
  createDefaultHeaders,
  headersToRecord,
  type HeaderEntry,
  ACCEPT_HEADER_ID,
  AUTHORIZATION_HEADER_ID,
} from './headersEditorUtils';

export const TryItOutHeadersEditor = ({
  headers: headersProp,
  onHeadersChange,
}: TryItOutHeadersEditorProps) => {
  const { viewerLang } = useTranslation();
  const [uncontrolledHeaders, setUncontrolledHeaders] = useState(createDefaultHeaders);

  const isControlled = headersProp !== undefined;
  const headers = isControlled ? headersProp : uncontrolledHeaders;

  const setHeaders = (next: HeaderEntry[]) => {
    if (!isControlled) {
      setUncontrolledHeaders(next);
    }
    onHeadersChange?.(next);
  };

  const updateHeader = (id: string, patch: Partial<Pick<HeaderEntry, 'name' | 'value'>>) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, ...patch } : header)));
  };

  const addHeader = () => {
    setHeaders([...headers, createCustomHeader()]);
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id || header.locked));
  };

  return (
    <div className={styles.section}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{viewerLang.tryItOutHeadersTitle}</h3>
        <Button variant="secondary" size="sm" type="button" onClick={addHeader}>
          {viewerLang.tryItOutAddHeader}
        </Button>
      </div>

      <div className={styles.rows}>
        {headers.map((header) => {
          const isAuthorization = header.name.toLowerCase() === 'authorization';

          return (
            <div key={header.id} className={styles.row}>
              <input
                className={styles.control}
                type="text"
                value={header.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateHeader(header.id, { name: event.target.value })
                }
                readOnly={header.locked}
                spellCheck={false}
                aria-label={
                  header.locked
                    ? header.name
                    : `${viewerLang.tryItOutHeaderName} ${header.name || viewerLang.tryItOutCustomHeader}`
                }
              />

              <input
                className={styles.control}
                type="text"
                value={header.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateHeader(header.id, { value: event.target.value })
                }
                placeholder={
                  isAuthorization
                    ? viewerLang.tryItOutAuthorizationPlaceholder
                    : header.name.toLowerCase() === 'accept'
                      ? viewerLang.tryItOutAcceptPlaceholder
                      : undefined
                }
                spellCheck={false}
                aria-label={`${header.name || viewerLang.tryItOutCustomHeader} ${viewerLang.tryItOutHeaderValue}`}
              />

              {!header.locked ? (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className={styles.remove}
                  onClick={() => removeHeader(header.id)}
                  aria-label={viewerLang.tryItOutRemoveHeader}
                >
                  {viewerLang.tryItOutRemoveHeader}
                </Button>
              ) : (
                <span className={styles.removeSpacer} aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
