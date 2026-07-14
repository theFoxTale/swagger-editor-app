'use client';

import { useTranslation } from '@/hooks';
import { getActiveTab, useEditorStore } from '@/store';

import styles from './EditorStatusBar.module.css';

export const EditorStatusBar = () => {
  const { editorLang } = useTranslation();
  const cursor = useEditorStore((state) => getActiveTab(state).cursor);
  const format = useEditorStore((state) => getActiveTab(state).format);
  const isValid = useEditorStore((state) => getActiveTab(state).isValid);
  const validationErrors = useEditorStore((state) => getActiveTab(state).validationErrors);

  return (
    <div className={styles.statusBar}>
      <div className={styles.left}>
        <span>
          {editorLang.line} {cursor.line}, {editorLang.column} {cursor.column}
        </span>
        <span className={styles.divider}>|</span>
        <span>{editorLang.spaces}: 2</span>
        <span className={styles.divider}>|</span>
        <span>{editorLang.encoding}</span>
        <span className={styles.divider}>|</span>
        <span>{editorLang.lineEnding}</span>
        <span className={styles.divider}>|</span>
        <span className={styles.formatBadge}>{format.toUpperCase()}</span>
      </div>

      <div className={styles.right}>
        {!isValid && validationErrors.length > 0 && (
          <span className={styles.errorHint} title={validationErrors.join('\n')}>
            {validationErrors[0]}
          </span>
        )}
        <span className={`${styles.validBadge} ${isValid ? styles.valid : styles.invalid}`}>
          <span className={styles.validDot} />
          {isValid ? editorLang.valid : editorLang.invalid}
        </span>
      </div>
    </div>
  );
};
