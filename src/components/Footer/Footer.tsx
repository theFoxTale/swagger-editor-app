export const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-cyan-500/10 bg-[#02050d]/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Swagger/OpenAPI UI. RS School Final Project.</p>

        <p className="text-slate-600">Built with Next.js and Supabase</p>
      </div>
    </footer>
  );
};
