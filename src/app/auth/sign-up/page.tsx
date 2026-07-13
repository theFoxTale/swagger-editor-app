import { redirect } from 'next/navigation';

import { AuthForm } from '@/components/common/AuthForm';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function SignUpPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,212,255,0.08),transparent_35%),radial-gradient(circle_at_75%_65%,rgba(139,92,246,0.1),transparent_35%)]" />
      <AuthForm mode="signup" />
    </div>
  );
}
