import Link from 'next/link';
import { getLocale } from '@/locales';
import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const locale = getLocale('ru');
  const lang = locale.header;

  return (
    <footer className={styles.footer}>
      <span>
        © {currentYear} {lang.logo}
      </span>
      <Link href="/about">{lang.nav.about}</Link>
    </footer>
  );
};
