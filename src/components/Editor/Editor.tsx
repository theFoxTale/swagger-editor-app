'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useAuthStore, getActiveTab, useEditorStore, useSavedSchemaStore } from '@/store';

import styles from './Editor.module.css';
import { EditorStatusBar } from './EditorStatusBar';
import { EditorTabBar } from './EditorTabBar';
import { EditorToolbar } from './EditorToolbar';

const EditorMonaco = dynamic(() => import('./EditorMonaco').then((mod) => mod.EditorMonaco), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading editor...</div>,
});

export const Editor = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const activeTabId = useEditorStore((state) => state.activeTabId);
  const content = useEditorStore((state) => getActiveTab(state).content);
  const format = useEditorStore((state) => getActiveTab(state).format);
  const validationErrors = useEditorStore((state) => getActiveTab(state).validationErrors);
  const isValid = useEditorStore((state) => getActiveTab(state).isValid);

  const setContent = useEditorStore((state) => state.setContent);
  const setCursor = useEditorStore((state) => state.setCursor);
  const restoreSavedSchema = useEditorStore((state) => state.restoreSavedSchema);

  const savedContent = useSavedSchemaStore((state) => state.savedContent);
  const savedFormat = useSavedSchemaStore((state) => state.savedFormat);
  const savedAt = useSavedSchemaStore((state) => state.savedAt);
  const ownerEmail = useSavedSchemaStore((state) => state.ownerEmail);

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.email &&
      savedContent &&
      savedFormat &&
      savedAt &&
      ownerEmail === user.email
    ) {
      restoreSavedSchema(savedContent, savedFormat, savedAt);
    }
  }, [
    isAuthenticated,
    user?.email,
    savedContent,
    savedFormat,
    savedAt,
    ownerEmail,
    restoreSavedSchema,
  ]);

  return (
    <section className={styles.editor} aria-label="OpenAPI Editor">
      <EditorTabBar />
      <EditorToolbar />

      <div className={styles.editorArea}>
        <EditorMonaco
          key={activeTabId}
          value={content}
          language={format === 'json' ? 'json' : 'yaml'}
          onChange={setContent}
          onCursorChange={(line, column) => setCursor({ line, column })}
        />
      </div>

      {!isValid && validationErrors.length > 0 && (
        <div className={styles.errorPanel} role="alert">
          <ul className={styles.errorList}>
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <EditorStatusBar />
    </section>
  );
};
