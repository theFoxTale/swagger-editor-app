'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './Nav.module.css';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavProps {
  links: NavLink[];
  className?: string;
}

const isLinkActive = (href: string, pathname: string): boolean => {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export const Nav = ({ links, className = '' }: NavProps) => {
  const pathname = usePathname();

  return (
    <nav className={`${styles.nav} ${className}`} aria-label="Main navigation">
      <ul className={styles.list}>
        {links.map(({ label, href }) => {
          const active = isLinkActive(href, pathname);

          return (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.link} ${active ? styles.active : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
