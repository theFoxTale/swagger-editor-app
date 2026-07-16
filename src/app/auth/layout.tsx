import { ReactNode } from 'react';

import styles from './authShell.module.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
