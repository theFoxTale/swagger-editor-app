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

  return <AuthForm mode="signup" />;
}
