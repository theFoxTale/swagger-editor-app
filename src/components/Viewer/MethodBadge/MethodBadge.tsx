import type { HttpMethod } from '@/lib/openapi';

import styles from './MethodBadge.module.css';

export interface MethodBadgeProps {
  method: HttpMethod;
  className?: string;
}

const METHOD_CLASS: Record<HttpMethod, string> = {
  get: styles.get,
  post: styles.post,
  put: styles.put,
  patch: styles.patch,
  delete: styles.delete,
  options: styles.options,
  head: styles.head,
  trace: styles.trace,
};

export const MethodBadge = ({ method, className = '' }: MethodBadgeProps) => {
  const classNames = [styles.badge, METHOD_CLASS[method], className].filter(Boolean).join(' ');

  return <span className={classNames}>{method.toUpperCase()}</span>;
};
