import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span>© {currentYear} SwaggerUI</span>
      <Link href="/about">О проекте</Link>
    </footer>
  );
};
