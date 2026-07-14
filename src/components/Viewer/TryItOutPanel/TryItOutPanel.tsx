'use client';

import { useId, useState, type ReactNode } from 'react';

import { Button } from '@/components/common';
import { useTranslation } from '@/hooks';

import styles from './TryItOutPanel.module.css';

export interface TryItOutPanelProps {
  children?: ReactNode; // Содержимое формы при активном «Try it out»
  active?: boolean; // Активное состояние (контролируемое). По умолчанию — внутреннее.
  defaultActive?: boolean;
  onActiveChange?: (active: boolean) => void;
}

export const TryItOutPanel = ({
  children,
  active: activeProp,
  defaultActive = false,
  onActiveChange,
}: TryItOutPanelProps) => {
  const { viewerLang } = useTranslation();
  const panelId = useId();
  const [uncontrolledActive, setUncontrolledActive] = useState(defaultActive);

  const isControlled = activeProp !== undefined;
  const active = isControlled ? activeProp : uncontrolledActive;

  const setActive = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledActive(next);
    }
    onActiveChange?.(next);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        {active ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActive(false)}
            aria-expanded
            aria-controls={panelId}
          >
            {viewerLang.cancelTryItOut}
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={() => setActive(true)} aria-expanded={false}>
            {viewerLang.tryItOut}
          </Button>
        )}
      </div>

      {active ? (
        <div
          id={panelId}
          className={styles.content}
          role="region"
          aria-label={viewerLang.tryItOutPanel}
        >
          {children ?? <p className={styles.placeholder}>{viewerLang.tryItOutPlaceholder}</p>}
        </div>
      ) : null}
    </div>
  );
};
