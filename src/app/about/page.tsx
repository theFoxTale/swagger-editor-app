import Link from 'next/link';

import styles from './about.module.css';

const team = [
  {
    initials: '𓃦',
    name: 'Anna',
    role: 'Frontend Developer',
    github: 'https://github.com/theFoxTale',
  },
  {
    initials: '𓅓',
    name: 'Uliana',
    role: 'Frontend Developer',
    github: 'https://github.com/Ulya10',
  },
  {
    initials: '𖤜',
    name: 'Kristina',
    role: 'Frontend Developer',
    github: 'https://github.com/Pchyolan',
  },
];

const technologies = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'OpenAPI',
  'Vitest',
];

export default function AboutPage() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.hero}>
            <div>
              <p className={styles.eyebrow}>Final React Project</p>

              <h1 className={styles.title}>Swagger/OpenAPI UI</h1>

              <p className={styles.tagline}>Edit. Validate. Explore. Test your APIs.</p>

              <p className={styles.description}>
                Swagger/OpenAPI UI is a modern interface for working with OpenAPI specifications.
                The application allows users to edit API schemas, explore endpoints, execute
                requests and review request history.
              </p>

              <div className={styles.actions}>
                <Link href="/" className={styles.primaryLink}>
                  Go to Editor
                </Link>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.secondaryLink}
                >
                  View on GitHub
                </a>
              </div>
            </div>

            <div className={styles.courseCardWrap}>
              <div className={styles.courseCard}>
                <p className={styles.courseEyebrow}>RS School</p>

                <h2 className={styles.courseTitle}>JavaScript / Front-end Course</h2>

                <p className={styles.courseSubtitle}>Final React Team Project</p>
              </div>
            </div>
          </div>

          <div className={styles.body}>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>

            <div className={styles.teamGrid}>
              {team.map((member) => (
                <article key={member.name} className={styles.memberCard}>
                  <div className={styles.avatar}>{member.initials}</div>

                  <h3 className={styles.memberName}>{member.name}</h3>

                  <p className={styles.memberRole}>{member.role}</p>

                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.memberLink}
                  >
                    GitHub profile
                  </a>
                </article>
              ))}
            </div>

            <div className={styles.techSection}>
              <h2 className={styles.sectionTitle}>Technology Stack</h2>

              <div className={styles.techList}>
                {technologies.map((technology) => (
                  <span key={technology} className={styles.techChip}>
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
