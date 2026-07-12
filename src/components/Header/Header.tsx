'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { useTranslation } from '@/hooks';
import { useLanguageStore } from '@/store';

import styles from './Header.module.css';

//TODO - заменить на Zustand
const MOCK_AUTH = true;

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(MOCK_AUTH);

  const { language, toggleLanguage } = useLanguageStore();
  const lang = useTranslation().header;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    window.location.href = '/auth/sign-in';
  };

  const handleSignUp = () => {
    window.location.href = '/auth/sign-up';
  };

  const handleLogout = () => {
    //TODO - заменить на Zustand
    setIsAuthenticated(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Логотип / название */}
      <Link href="/" className={styles.logo}>
        {lang.logo}
      </Link>

      {/* Навигация */}
      <nav className={styles.nav}>
        <Link href="/">{lang.nav.editor}</Link>
        <Link href="/about">{lang.nav.about}</Link>
        {isAuthenticated && <Link href="/history">{lang.nav.history}</Link>}
      </nav>

      <div className={styles.buttonsContainer}>
        <div className={styles.languageSwitcher}>
          <button
            className={`${styles.langBtn} ${language === 'ru' ? styles.active : ''}`}
            onClick={toggleLanguage}
          >
            {lang.language.ru}
          </button>
          <button
            className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
            onClick={toggleLanguage}
          >
            {lang.language.en}
          </button>
        </div>

        <div className={styles.authButtons}>
          {!isAuthenticated ? (
            <>
              <button className={styles.button} onClick={handleSignIn}>
                {lang.auth.signIn}
              </button>
              <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleSignUp}>
                {lang.auth.signUp}
              </button>
            </>
          ) : (
            <>
              <button className={styles.button} onClick={handleLogout}>
                {lang.auth.logout}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
