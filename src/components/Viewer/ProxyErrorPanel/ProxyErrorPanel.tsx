'use client';

import { useTranslation } from '@/hooks';
import { formatMessage } from '@/lib/i18n';
import {
  classifyProxyTransportError,
  getProxyTransportErrorDetail,
  type ProxyErrorResponse,
} from '@/lib/proxy';

import responseStyles from '../ResponsePanel/ResponsePanel.module.css';
import { formatDuration } from '../ResponsePanel/responsePanelUtils';
import styles from './ProxyErrorPanel.module.css';

export interface ProxyErrorPanelProps {
  response: ProxyErrorResponse;
}

export const ProxyErrorPanel = ({ response }: ProxyErrorPanelProps) => {
  const { viewerLang } = useTranslation();
  const kind = classifyProxyTransportError(response.error);
  const detail = getProxyTransportErrorDetail(response);

  const message =
    kind === 'dns'
      ? viewerLang.tryItOutProxyErrorDns
      : kind === 'timeout'
        ? viewerLang.tryItOutProxyErrorTimeout
        : kind === 'network'
          ? viewerLang.tryItOutProxyErrorNetwork
          : viewerLang.tryItOutProxyErrorGeneric;

  return (
    <section className={responseStyles.panel} aria-label={viewerLang.tryItOutResponseTitle}>
      <div className={responseStyles.meta}>
        <h3 className={responseStyles.title}>{viewerLang.tryItOutResponseTitle}</h3>
        <div className={responseStyles.metaRow}>
          <span
            className={`${responseStyles.status} ${responseStyles.statusServerError}`}
            role="status"
          >
            502 {viewerLang.tryItOutProxyErrorStatusText}
          </span>
          <span className={responseStyles.duration}>
            {viewerLang.tryItOutResponseDuration}: {formatDuration(response.durationMs)}
          </span>
        </div>
      </div>

      <div className={styles.content} role="alert">
        <p className={styles.message}>{message}</p>
        <p className={styles.hint}>{viewerLang.tryItOutProxyErrorHint}</p>
        {detail ? (
          <p className={styles.detail}>
            {formatMessage(viewerLang.tryItOutProxyErrorDetail, { detail })}
          </p>
        ) : null}
      </div>
    </section>
  );
};
