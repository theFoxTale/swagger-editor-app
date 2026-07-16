'use client';

import { Button } from '@/components/common';
import { useTranslation } from '@/hooks';
import { getActiveTab, useAuthStore, useEditorStore, useSavedSchemaStore } from '@/store';

import styles from './EditorToolbar.module.css';

const FormatIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M2 4h12M2 8h8M2 12h10" strokeLinecap="round" />
  </svg>
);

const ValidateIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 2h8l2 2v10H3V2z" />
    <path d="M5 2v4h6V2M5 11h6" strokeLinecap="round" />
  </svg>
);

const formatSavedTime = (timestamp: number | null, labels: { justNow: string; ago: string }) => {
  if (!timestamp) {
    return null;
  }

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return labels.justNow;
  }

  if (diffMinutes < 60) {
    return labels.ago.replace('{time}', `${diffMinutes}m`);
  }

  const diffHours = Math.floor(diffMinutes / 60);
  return labels.ago.replace('{time}', `${diffHours}h`);
};

export const EditorToolbar = () => {
  const { editorLang } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  const format = useEditorStore((state) => getActiveTab(state).format);
  const lastSavedAt = useEditorStore((state) => getActiveTab(state).lastSavedAt);
  const isValid = useEditorStore((state) => getActiveTab(state).isValid);
  const content = useEditorStore((state) => getActiveTab(state).content);

  const formatDocument = useEditorStore((state) => state.formatDocument);
  const validate = useEditorStore((state) => state.validate);
  const toggleFormat = useEditorStore((state) => state.toggleFormat);
  const saveSchema = useEditorStore((state) => state.saveSchema);

  const persistSchema = useSavedSchemaStore((state) => state.persistSchema);

  const savedLabel = isLoading
    ? null
    : formatSavedTime(lastSavedAt, {
        justNow: editorLang.savedJustNow,
        ago: editorLang.savedAgo,
      });

  const canSave = !isLoading && isAuthenticated;

  const handleSave = () => {
    if (!canSave || !user?.email) {
      return;
    }

    saveSchema();
    persistSchema(user.email, content, format);
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.leftGroup}>
        <button type="button" className={styles.actionBtn} onClick={formatDocument}>
          <FormatIcon />
          <span className={styles.actionLabel}>{editorLang.format}</span>
        </button>

        <button type="button" className={styles.actionBtn} onClick={validate}>
          <ValidateIcon />
          <span className={styles.actionLabel}>{editorLang.validate}</span>
        </button>

        <div className={styles.formatToggle} role="group" aria-label="Schema format">
          <button
            type="button"
            className={`${styles.formatBtn} ${format === 'yaml' ? styles.formatBtnActive : ''}`}
            onClick={() => format !== 'yaml' && toggleFormat()}
            aria-pressed={format === 'yaml'}
          >
            {editorLang.yaml}
          </button>
          <button
            type="button"
            className={`${styles.formatBtn} ${format === 'json' ? styles.formatBtnActive : ''}`}
            onClick={() => format !== 'json' && toggleFormat()}
            aria-pressed={format === 'json'}
          >
            {editorLang.json}
          </button>
        </div>
      </div>

      <div className={styles.rightGroup}>
        {savedLabel ? (
          <span className={`${styles.savedStatus} ${isValid ? styles.savedValid : ''}`}>
            {isValid && <ValidateIcon />}
            {savedLabel}
          </span>
        ) : null}

        <Button
          variant="primary"
          size="sm"
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!canSave}
          title={!isLoading && !isAuthenticated ? editorLang.loginToSave : undefined}
        >
          <SaveIcon />
          <span>{editorLang.saveSchema}</span>
        </Button>
      </div>
    </div>
  );
};
