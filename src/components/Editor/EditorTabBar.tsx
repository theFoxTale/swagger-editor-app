'use client';

import { useTranslation } from '@/hooks';
import { useEditorStore } from '@/store';

import styles from './EditorTabBar.module.css';

const CloseIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
  </svg>
);

export const EditorTabBar = () => {
  const { editorLang } = useTranslation();
  const tabs = useEditorStore((state) => state.tabs);
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const addTab = useEditorStore((state) => state.addTab);
  const closeTab = useEditorStore((state) => state.closeTab);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);

  const canCloseTabs = tabs.length > 1;

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabsList} role="tablist" aria-label={editorLang.tabsLabel}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            >
              <button
                type="button"
                className={styles.tabButton}
                onClick={() => setActiveTab(tab.id)}
              >
                <span
                  className={`${styles.dot} ${tab.isValid ? styles.dotValid : styles.dotInvalid}`}
                />
                <span className={styles.tabLabel}>{tab.fileName}</span>
                {tab.isDirty && <span className={styles.dirtyMark} aria-hidden="true" />}
              </button>

              {canCloseTabs && (
                <button
                  type="button"
                  className={styles.closeTab}
                  onClick={() => closeTab(tab.id)}
                  aria-label={`${editorLang.closeTab}: ${tab.fileName}`}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.addTab}
        onClick={addTab}
        aria-label={editorLang.newTab}
        title={editorLang.newTab}
      >
        +
      </button>
    </div>
  );
};
