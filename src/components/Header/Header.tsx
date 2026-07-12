'use client';

import Image from 'next/image';
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
  const { headerLang } = useTranslation();

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
      <div className={styles.logoWrapper}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo-transparent.png"
            alt="SwaggerUI logo"
            width={32}
            height={32}
            priority
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>{headerLang.logo}</span>
        </Link>
      </div>

      {/* Навигация */}
      <nav className={styles.nav}>
        <Link href="/">{headerLang.nav.editor}</Link>
        <Link href="/about">{headerLang.nav.about}</Link>
        {isAuthenticated && <Link href="/history">{headerLang.nav.history}</Link>}
      </nav>

      <div className={styles.buttonsContainer}>
        <div className={styles.languageSwitcher}>
          <button
            className={`${styles.langBtn} ${language === 'ru' ? styles.active : ''}`}
            onClick={toggleLanguage}
          >
            {headerLang.language.ru}
          </button>
          <button
            className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
            onClick={toggleLanguage}
          >
            {headerLang.language.en}
          </button>
        </div>

        <div className={styles.authButtons}>
          {!isAuthenticated ? (
            <>
              <button className={styles.button} onClick={handleSignIn}>
                {headerLang.auth.signIn}
              </button>
              <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleSignUp}>
                {headerLang.auth.signUp}
              </button>
            </>
          ) : (
            <>
              <button className={styles.button} onClick={handleLogout}>
                {headerLang.auth.logout}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
