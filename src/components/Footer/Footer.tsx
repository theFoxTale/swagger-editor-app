'use client';

import Link from 'next/link';

import { useTranslation } from '@/hooks';

import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const lang = useTranslation().header;

  return (
    <footer className={styles.footer}>
      <span>
        © {currentYear} {lang.logo}
      </span>
      <Link href="/about">{lang.nav.about}</Link>
    </footer>
  );
};
