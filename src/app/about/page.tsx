import Link from 'next/link';

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
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#050816]/90 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
        <div className="grid gap-10 border-b border-slate-800 p-8 md:grid-cols-[1.4fr_0.6fr] md:p-12">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-400">
              Final React Project
            </p>

            <h1 className="text-4xl font-bold text-white md:text-5xl">Swagger/OpenAPI UI</h1>

            <p className="mt-4 max-w-2xl text-lg text-cyan-300">
              Edit. Validate. Explore. Test your APIs.
            </p>

            <p className="mt-6 max-w-2xl leading-7 text-slate-400">
              Swagger/OpenAPI UI is a modern interface for working with OpenAPI specifications. The
              application allows users to edit API schemas, explore endpoints, execute requests and
              review request history.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-lg border border-cyan-400/50 px-5 py-3 text-cyan-200 transition hover:bg-cyan-400/10"
              >
                Go to Editor
              </Link>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-purple-500/40 px-5 py-3 text-purple-200 transition hover:bg-purple-500/10"
              >
                View on GitHub
              </a>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-2xl border border-purple-500/40 bg-purple-500/5 p-8 shadow-[0_0_30px_rgba(139,92,246,0.08)]">
              <p className="text-sm uppercase tracking-[0.25em] text-purple-300">RS School</p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                JavaScript / Front-end Course
              </h2>

              <p className="mt-2 text-slate-400">Final React Team Project</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="mb-6 text-2xl font-semibold text-white">Meet the Team</h2>

          <div className="grid gap-5 md:grid-cols-3">
            {team.map((member) => (
              <article
                key={member.name}
                className="rounded-xl border border-cyan-500/20 bg-[#080d1c] p-6 transition hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.08)]"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-purple-400/60 bg-purple-500/10 text-lg font-semibold text-white">
                  {member.initials}
                </div>

                <h3 className="text-lg font-semibold text-white">{member.name}</h3>

                <p className="mt-1 text-sm text-cyan-400">{member.role}</p>

                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm text-slate-500 transition hover:text-white"
                >
                  GitHub profile
                </a>
              </article>
            ))}
          </div>

          <div className="mt-12 border-t border-slate-800 pt-10">
            <h2 className="mb-6 text-2xl font-semibold text-white">Technology Stack</h2>

            <div className="flex flex-wrap gap-3">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-lg border border-slate-700 bg-[#080d1c] px-4 py-3 text-sm text-slate-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
