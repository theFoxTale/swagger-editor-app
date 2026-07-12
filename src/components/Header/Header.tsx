'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import styles from './Header.module.css';

//TODO - заменить на Zustand
const MOCK_AUTH = false;

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(MOCK_AUTH);

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

  const handleHistory = () => {
    window.location.href = '/history';
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Логотип / название */}
      <Link href="/" className={styles.logo}>
        SwaggerUI
      </Link>

      {/* Навигация */}
      <nav className={styles.nav}>
        <Link href="/">Редактор</Link>
        <Link href="/about">О проекте</Link>
        {isAuthenticated && <Link href="/history">История</Link>}
      </nav>

      <div className={styles.buttonsContainer}>
        <div className={styles.languageSwitcher}>
          <button className={`${styles.langBtn} ${styles.active}`}>RU</button>
          <button className={styles.langBtn}>EN</button>
        </div>

        <div className={styles.authButtons}>
          {!isAuthenticated ? (
            <>
              <button className={styles.button} onClick={handleSignIn}>
                Войти
              </button>
              <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleSignUp}>
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              <button className={styles.button} onClick={handleHistory}>
                История
              </button>
              <button className={styles.button} onClick={handleLogout}>
                Выйти
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
