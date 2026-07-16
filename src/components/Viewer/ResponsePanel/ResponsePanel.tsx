'use client';

import { useState } from 'react';

import { useTranslation } from '@/hooks';
import type { ProxySuccessResponse } from '@/lib/proxy';

import { getResponseStatusTone } from '../schemaUtils';
import styles from './ResponsePanel.module.css';
import { formatDuration, formatResponseBody, getResponseContentType } from './responsePanelUtils';

export interface ResponsePanelProps {
  response: ProxySuccessResponse;
}

type ResponseTab = 'body' | 'headers';

const STATUS_TONE_CLASS = {
  info: styles.statusInfo,
  success: styles.statusSuccess,
  redirect: styles.statusRedirect,
  clientError: styles.statusClientError,
  serverError: styles.statusServerError,
  default: styles.statusDefault,
} as const;

export { formatDuration, formatResponseBody, getResponseContentType } from './responsePanelUtils';

export const ResponsePanel = ({ response }: ResponsePanelProps) => {
  const { viewerLang } = useTranslation();
  const [tab, setTab] = useState<ResponseTab>('body');

  const tone = getResponseStatusTone(String(response.status));
  const contentType = getResponseContentType(response);
  const formattedBody = formatResponseBody(response.body, contentType);
  const headerEntries = Object.entries(response.headers).sort(([left], [right]) =>
    left.localeCompare(right)
  );

  return (
    <section className={styles.panel} aria-label={viewerLang.tryItOutResponseTitle}>
      <div className={styles.meta}>
        <h3 className={styles.title}>{viewerLang.tryItOutResponseTitle}</h3>
        <div className={styles.metaRow}>
          <span className={`${styles.status} ${STATUS_TONE_CLASS[tone]}`}>
            {response.status} {response.statusText}
          </span>
          <span className={styles.duration}>
            {viewerLang.tryItOutResponseDuration}: {formatDuration(response.durationMs)}
          </span>
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label={viewerLang.tryItOutResponseTitle}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'body'}
          className={`${styles.tab} ${tab === 'body' ? styles.tabActive : ''}`.trim()}
          onClick={() => setTab('body')}
        >
          {viewerLang.tryItOutResponseBodyTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'headers'}
          className={`${styles.tab} ${tab === 'headers' ? styles.tabActive : ''}`.trim()}
          onClick={() => setTab('headers')}
        >
          {viewerLang.tryItOutResponseHeadersTab}
          <span className={styles.tabCount}>{headerEntries.length}</span>
        </button>
      </div>

      {tab === 'body' ? (
        <div className={styles.tabPanel} role="tabpanel">
          {formattedBody ? (
            <pre className={styles.body}>{formattedBody}</pre>
          ) : (
            <p className={styles.empty}>{viewerLang.tryItOutResponseBodyEmpty}</p>
          )}
        </div>
      ) : (
        <div className={styles.tabPanel} role="tabpanel">
          {headerEntries.length > 0 ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">{viewerLang.tryItOutHeaderName}</th>
                    <th scope="col">{viewerLang.tryItOutHeaderValue}</th>
                  </tr>
                </thead>
                <tbody>
                  {headerEntries.map(([name, value]) => (
                    <tr key={name}>
                      <td>
                        <code className={styles.headerName}>{name}</code>
                      </td>
                      <td>
                        <code className={styles.headerValue}>{value}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.empty}>{viewerLang.tryItOutResponseHeadersEmpty}</p>
          )}
        </div>
      )}
    </section>
  );
};
