import Link from 'next/link';

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            Swagger / OpenAPI UI
          </p>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-white md:text-6xl">
            Edit, explore and test your APIs in one place
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Work with OpenAPI specifications, inspect endpoints, execute requests and review your
            request history in a single modern interface.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="rounded-lg border border-cyan-400/50 px-5 py-3 font-medium text-cyan-100 transition hover:bg-cyan-400/10"
            >
              About Project
            </Link>

            <Link
              href="/auth/sign-in"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative rounded-2xl border border-cyan-500/30 bg-[#050816]/90 p-8 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-slate-500">OpenAPI 3.0</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                Ready
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-800 bg-[#080d1c] p-4">
                <span className="mr-3 rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">
                  GET
                </span>
                <span className="text-slate-300">/users</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#080d1c] p-4">
                <span className="mr-3 rounded bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-300">
                  POST
                </span>
                <span className="text-slate-300">/auth/login</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#080d1c] p-4">
                <span className="mr-3 rounded bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-300">
                  PATCH
                </span>
                <span className="text-slate-300">/users/&#123;id&#125;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
