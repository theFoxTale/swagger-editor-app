'use client';

import Link from 'next/link';

import { useTranslation } from '@/hooks';

import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { headerLang } = useTranslation();

  return (
    <footer className={styles.footer}>
      <span>
        © {currentYear} {headerLang.logo}
      </span>
      <Link href="/about">{headerLang.nav.about}</Link>
    </footer>
  );
};
