import Link from 'next/link';

export const Header = () => {
  return (
    <header className="flex items-center justify-between border-b px-8 py-4">
      <Link href="/" className="text-2xl font-bold">
        Swagger Editor
      </Link>

      <nav className="flex items-center gap-6">
        <Link href="/about">About</Link>
        <Link href="/auth/sign-in">Sign In</Link>
        <Link href="/auth/sign-up">Sign Up</Link>
      </nav>
    </header>
  );
};
