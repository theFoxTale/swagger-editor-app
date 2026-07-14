'use client';

import { useTranslation } from '@/hooks';
import { formatMessage } from '@/lib/i18n';

import styles from './ViewerHeader.module.css';

export interface ViewerHeaderProps {
  title: string;
  version: string;
  description?: string;
  serverUrl: string | null;
}

export const ViewerHeader = ({ title, version, description, serverUrl }: ViewerHeaderProps) => {
  const { viewerLang } = useTranslation();

  const versionAriaLabel = formatMessage(viewerLang.versionLabel, { version });
  const descriptionText = description?.trim() ? description : viewerLang.noDescription;

  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.version} aria-label={versionAriaLabel} title={versionAriaLabel}>
          {version}
        </span>
      </div>

      {serverUrl ? (
        <p className={styles.baseUrl}>
          <span className={styles.baseUrlLabel}>{viewerLang.baseUrl}:</span>
          <a
            className={styles.baseUrlLink}
            href={serverUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={formatMessage(viewerLang.baseUrlLinkLabel, { url: serverUrl })}
          >
            {serverUrl}
          </a>
        </p>
      ) : (
        <p className={styles.noBaseUrl}>{viewerLang.noBaseUrl}</p>
      )}

      <p
        className={`${styles.description} ${description?.trim() ? '' : styles.descriptionMuted}`.trim()}
      >
        {descriptionText}
      </p>
    </header>
  );
};
