'use client';

import styles from './Header.module.css';

const NAV_PLACEHOLDER_COUNT = 2;

export const HeaderSignInSkeleton = () => {
  return (
    <header className={`${styles.header} ${styles.skeleton}`} aria-hidden="true">
      {/* Логотип / название */}
      <div className={styles.logoWrapper}>
        <div className={styles.logoLink}>
          <div className={`${styles.skeletonBox} ${styles.skeletonLogo}`} />
          <div className={styles.logoTextContainer}>
            <div className={`${styles.skeletonBox} ${styles.skeletonText}`} />
            <div className={`${styles.skeletonBox} ${styles.skeletonTextSmall}`} />
          </div>
        </div>
      </div>

      {/* Навигация */}
      <nav aria-label="Loading navigation">
        <div className={styles.skeletonList}>
          {Array.from({ length: NAV_PLACEHOLDER_COUNT }, (_, index) => (
            <div key={index} className={`${styles.skeletonBox} ${styles.skeletonNavLink}`} />
          ))}
        </div>
      </nav>

      {/* Все кнопки */}
      <div className={styles.actions}>
        <div className={`${styles.skeletonBox} ${styles.skeletonLanguageSwitcher}`} />

        <div className={styles.authButtons}>
          <div className={`${styles.skeletonBox} ${styles.skeletonButton}`} />
          <div className={`${styles.skeletonBox} ${styles.skeletonButton}`} />
        </div>

        <div className={`${styles.skeletonBox} ${styles.skeletonThemeToggle}`} />
      </div>
    </header>
  );
};
