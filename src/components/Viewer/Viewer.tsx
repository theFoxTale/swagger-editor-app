'use client';

import { useMemo } from 'react';

import { useTranslation } from '@/hooks';
import { extractEndpoints } from '@/lib/openapi';
import { getActiveTab, useEditorStore } from '@/store';

import styles from './Viewer.module.css';
import { ViewerContent } from './ViewerContent';
import type { ViewerSchemaState } from './ViewerEmptyState';

const resolveSchemaState = (
  content: string,
  isValid: boolean,
  hasExtracted: boolean
): ViewerSchemaState | 'ready' => {
  if (hasExtracted) {
    return 'ready';
  }

  if (!content.trim()) {
    return 'empty';
  }

  if (!isValid) {
    return 'invalid';
  }

  return 'empty';
};

export const Viewer = () => {
  const { viewerLang } = useTranslation();
  const content = useEditorStore((state) => getActiveTab(state).content);
  const parsedSpec = useEditorStore((state) => getActiveTab(state).parsedSpec);
  const isValid = useEditorStore((state) => getActiveTab(state).isValid);
  const validationErrors = useEditorStore((state) => getActiveTab(state).validationErrors);

  const extracted = useMemo(
    () => (isValid ? extractEndpoints(parsedSpec) : null),
    [isValid, parsedSpec]
  );

  const schemaState = resolveSchemaState(content, isValid, extracted !== null);

  return (
    <section className={styles.viewer} aria-label={viewerLang.title}>
      <div className={styles.scrollArea}>
        <ViewerContent
          extracted={extracted}
          schemaState={schemaState}
          validationErrors={validationErrors}
        />
      </div>
    </section>
  );
};
