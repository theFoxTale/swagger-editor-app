'use client';

import { useId, useState, type ReactNode } from 'react';

import type { Operation, TagGroup as TagGroupData } from '@/lib/openapi';

import { EndpointRow } from '../EndpointRow/EndpointRow';
import styles from './TagGroup.module.css';

export interface TagGroupProps {
  group: TagGroupData;
  /** Controlled open state. If omitted, uses internal state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Currently expanded endpoint operation id (controlled by parent). */
  expandedOperationId?: string | null;
  onToggleOperation?: (operationId: string) => void;
  renderDetails?: (operation: Operation) => ReactNode;
}

const TagIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M2.5 8.5V3.5A1 1 0 0 1 3.5 2.5h5l5 5-5 5-5-5z" strokeLinejoin="round" />
    <circle cx="5.5" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ACCENT_CLASSES = [
  styles.accentPurple,
  styles.accentCyan,
  styles.accentBlue,
  styles.accentPink,
];

export const getTagAccentClass = (name: string): string => {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash + name.charCodeAt(index) * (index + 1)) % ACCENT_CLASSES.length;
  }
  return ACCENT_CLASSES[hash] ?? styles.accentPurple;
};

export const TagGroup = ({
  group,
  open,
  defaultOpen = false,
  onOpenChange,
  expandedOperationId = null,
  onToggleOperation,
  renderDetails,
}: TagGroupProps) => {
  const contentId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const accentClass = getTagAccentClass(group.name);

  const setOpen = (next: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <section className={`${styles.group} ${isOpen ? styles.open : ''} ${accentClass}`}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={`${group.name} tag group`}
      >
        <span className={styles.icon}>
          <TagIcon />
        </span>

        <span className={styles.meta}>
          <span className={styles.name}>{group.name}</span>
          {group.description && <span className={styles.description}>{group.description}</span>}
        </span>

        <span className={styles.count}>{group.operations.length}</span>

        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
          <ChevronIcon />
        </span>
      </button>

      {isOpen && (
        <div id={contentId} className={styles.content} role="region" aria-label={group.name}>
          <ul className={styles.list}>
            {group.operations.map((operation) => {
              const expanded = expandedOperationId === operation.id;

              return (
                <li key={operation.id} className={styles.item}>
                  <EndpointRow
                    operation={operation}
                    expanded={expanded}
                    onToggle={() => onToggleOperation?.(operation.id)}
                  >
                    {expanded && renderDetails?.(operation)}
                  </EndpointRow>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};
