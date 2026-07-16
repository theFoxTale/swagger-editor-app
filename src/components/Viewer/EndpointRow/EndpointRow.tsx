'use client';

import { useId, type KeyboardEvent, type ReactNode } from 'react';

import { useTranslation } from '@/hooks';
import { formatMessage } from '@/lib/i18n';
import type { Operation } from '@/lib/openapi';

import { MethodBadge } from '../MethodBadge';
import styles from './EndpointRow.module.css';

export interface EndpointRowProps {
  operation: Operation;
  expanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}

const LockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="3.5" y="7" width="9" height="7" rx="1.5" />
    <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const operationRequiresAuth = (operation: Operation): boolean =>
  Boolean(operation.security?.some((requirement) => Object.keys(requirement).length > 0));

export const EndpointRow = ({
  operation,
  expanded = false,
  onToggle,
  children,
}: EndpointRowProps) => {
  const { viewerLang } = useTranslation();
  const detailsId = useId();
  const requiresAuth = operationRequiresAuth(operation);
  const method = operation.method.toUpperCase();

  const toggleLabel = formatMessage(
    expanded ? viewerLang.collapseEndpoint : viewerLang.expandEndpoint,
    { method, path: operation.path }
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape' && expanded) {
      event.preventDefault();
      onToggle?.();
    }
  };

  return (
    <div
      className={`${styles.row} ${expanded ? styles.expanded : ''} ${operation.deprecated ? styles.deprecated : ''}`}
    >
      <button
        type="button"
        className={styles.toggle}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
        aria-controls={expanded ? detailsId : undefined}
        aria-label={toggleLabel}
      >
        <MethodBadge method={operation.method} />

        <span className={styles.path}>{operation.path}</span>

        {operation.summary && <span className={styles.summary}>{operation.summary}</span>}

        <span className={styles.trailing}>
          {requiresAuth && (
            <span className={styles.lock} title={viewerLang.requiresAuth}>
              <LockIcon />
            </span>
          )}
          <span
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
            aria-hidden="true"
          >
            <ChevronIcon />
          </span>
        </span>
      </button>

      {expanded && children ? (
        <div id={detailsId} className={styles.details} role="region" aria-label={toggleLabel}>
          {children}
        </div>
      ) : null}
    </div>
  );
};
