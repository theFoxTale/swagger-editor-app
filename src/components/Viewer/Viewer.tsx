'use client';

import { useMemo } from 'react';

import { useTranslation } from '@/hooks';
import { extractEndpoints, getServerUrl } from '@/lib/openapi';
import { getActiveTab, useEditorStore } from '@/store';

import styles from './Viewer.module.css';
import { ViewerHeader } from './ViewerHeader/ViewerHeader';

export const Viewer = () => {
  const { viewerLang } = useTranslation();
  const parsedSpec = useEditorStore((state) => getActiveTab(state).parsedSpec);
  const isValid = useEditorStore((state) => getActiveTab(state).isValid);

  const extracted = useMemo(
    () => (isValid ? extractEndpoints(parsedSpec) : null),
    [isValid, parsedSpec]
  );

  const serverUrl = getServerUrl(extracted);

  return (
    <section className={styles.viewer} aria-label={viewerLang.title}>
      <div className={styles.scrollArea}>
        {extracted ? (
          <ViewerHeader
            title={extracted.info.title}
            version={extracted.info.version}
            description={extracted.info.description}
            serverUrl={serverUrl}
          />
        ) : (
          <p className={styles.placeholder}>{viewerLang.emptySchema}</p>
        )}
      </div>
    </section>
  );
};
