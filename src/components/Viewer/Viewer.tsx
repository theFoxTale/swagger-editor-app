'use client';

import { useTranslation } from '@/hooks';
import { getActiveTab, useEditorStore } from '@/store';

import styles from '../Viewer/Viewer.module.css';

export const Viewer = () => {
  const { viewerLang } = useTranslation();
  const parsedSpec = useEditorStore((state) => getActiveTab(state).parsedSpec);
  const isValid = useEditorStore((state) => getActiveTab(state).isValid);

  const title =
    isValid && parsedSpec && typeof parsedSpec.info === 'object' && parsedSpec.info !== null
      ? String((parsedSpec.info as Record<string, unknown>).title ?? viewerLang.title)
      : viewerLang.title;

  return (
    <section className={styles.viewer} aria-label={viewerLang.title}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {!isValid && <p className={styles.placeholder}>{viewerLang.emptySchema}</p>}
      </header>
    </section>
  );
};
