'use client';

import { useTranslation } from '@/hooks';

import styles from './ViewerEmptyState.module.css';

export type ViewerSchemaState = 'empty' | 'invalid';

export interface ViewerEmptyStateProps {
  state: ViewerSchemaState;
  validationErrors?: string[];
}

export const ViewerEmptyState = ({ state, validationErrors = [] }: ViewerEmptyStateProps) => {
  const { viewerLang } = useTranslation();

  if (state === 'invalid') {
    return (
      <div className={`${styles.state} ${styles.invalid}`} role="status">
        <h3 className={styles.title}>{viewerLang.invalidSchemaTitle}</h3>
        <p className={styles.description}>{viewerLang.invalidSchema}</p>
        {validationErrors.length > 0 ? (
          <ul className={styles.errorList}>
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.hint}>{viewerLang.invalidSchemaHint}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.state} ${styles.empty}`} role="status">
      <h3 className={styles.title}>{viewerLang.emptySchemaTitle}</h3>
      <p className={styles.description}>{viewerLang.emptySchema}</p>
    </div>
  );
};
