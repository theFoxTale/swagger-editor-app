'use client';

import { useMemo } from 'react';

import { useTranslation } from '@/hooks';
import { extractEndpoints } from '@/lib/openapi';
import { getActiveTab, useEditorStore } from '@/store';

import styles from './Viewer.module.css';
import { ViewerContent } from './ViewerContent';

export const Viewer = () => {
  const { viewerLang } = useTranslation();
  const parsedSpec = useEditorStore((state) => getActiveTab(state).parsedSpec);
  const isValid = useEditorStore((state) => getActiveTab(state).isValid);

  const extracted = useMemo(
    () => (isValid ? extractEndpoints(parsedSpec) : null),
    [isValid, parsedSpec]
  );

  return (
    <section className={styles.viewer} aria-label={viewerLang.title}>
      <div className={styles.scrollArea}>
        <ViewerContent extracted={extracted} />
      </div>
    </section>
  );
};
