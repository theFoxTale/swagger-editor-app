'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components';
import { useTranslation } from '@/hooks';

import styles from './page.module.css';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { commonLang } = useTranslation();
  const t = commonLang.unauthorized;

  const handleGoHome = () => router.push('/');
  const handleSignIn = () => router.push('/auth/sign-in');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.description}>{t.description}</p>
        <div className={styles.actions}>
          <Button variant="primary" onClick={handleGoHome}>
            {t.goHome}
          </Button>
          <Button variant="secondary" onClick={handleSignIn}>
            {t.signIn}
          </Button>
        </div>
      </div>
    </div>
  );
}
