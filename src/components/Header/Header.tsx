'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Button, Nav, ThemeToggle } from '@/components';
import { useTranslation } from '@/hooks';
import { useAuthStore, useLanguageStore } from '@/store';

import styles from './Header.module.css';
import { HeaderLogoutSkeleton } from './HeaderLogoutSkeleton';
import { HeaderSignInSkeleton } from './HeaderSignInSkeleton';

export const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated, isLoading, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { headerLang } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = useMemo(
    () => [
      { label: headerLang.nav.editor, href: '/' },
      ...(isAuthenticated ? [{ label: headerLang.nav.history, href: '/history' }] : []),
      { label: headerLang.nav.about, href: '/about' },
    ],
    [headerLang.nav, isAuthenticated]
  );

  const handleSignIn = () => {
    void router.push('/auth/sign-in');
  };

  const handleSignUp = () => {
    void router.push('/auth/sign-up');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  if (isLoading && isAuthenticated) {
    return <HeaderSignInSkeleton />;
  }

  if (isLoading && !isAuthenticated) {
    return <HeaderLogoutSkeleton />;
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Логотип / название */}
      <div className={styles.logoWrapper}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo-transparent.png"
            alt="SwaggerUI logo"
            width={28}
            height={28}
            priority
            className={styles.logoIcon}
          />

          <div className={styles.logoTextContainer}>
            <span className={styles.logoText}>{headerLang.logo}</span>
            <span className={styles.logoDescription}>{headerLang.description}</span>
          </div>
        </Link>
      </div>

      {/* Навигация */}
      <Nav links={navLinks} className={styles.nav} />

      <div className={styles.actions}>
        {/* Выбор языка */}
        <div className={styles.languageSwitcher} role="group" aria-label="Language">
          <button
            type="button"
            className={`${styles.langBtn} ${language === 'ru' ? styles.langBtnActive : ''}`}
            onClick={() => setLanguage('ru')}
            aria-pressed={language === 'ru'}
          >
            {headerLang.language.ru}
          </button>
          <button
            type="button"
            className={`${styles.langBtn} ${language === 'en' ? styles.langBtnActive : ''}`}
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
          >
            {headerLang.language.en}
          </button>
        </div>

        {/* Кнопки авторизации */}
        <div className={styles.authButtons}>
          {!isAuthenticated ? (
            <>
              <Button variant="secondary" size="sm" onClick={handleSignIn}>
                {headerLang.auth.signIn}
              </Button>
              <Button variant="primary" size="sm" onClick={handleSignUp}>
                {headerLang.auth.signUp}
              </Button>
            </>
          ) : (
            <Button variant="danger" size="sm" onClick={() => void handleLogout()}>
              {headerLang.auth.logout}
            </Button>
          )}
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
};
