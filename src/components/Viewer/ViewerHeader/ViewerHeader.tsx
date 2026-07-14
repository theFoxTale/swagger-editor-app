'use client';

import { useTranslation } from '@/hooks';

import styles from './ViewerHeader.module.css';

export interface ViewerHeaderProps {
  title: string;
  version: string;
  description?: string;
  serverUrl: string | null;
}

export const ViewerHeader = ({ title, version, description, serverUrl }: ViewerHeaderProps) => {
  const { viewerLang } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.version}>{version}</span>
      </div>

      {serverUrl && (
        <p className={styles.baseUrl}>
          <span className={styles.baseUrlLabel}>{viewerLang.baseUrl}:</span>
          <a
            className={styles.baseUrlLink}
            href={serverUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {serverUrl}
          </a>
        </p>
      )}

      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
};
