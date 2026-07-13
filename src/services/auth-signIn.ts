'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { supabase } from '@/lib/supabase';

export default async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();
  if (!data) {
    return { error: 'Invalid email or password' };
  }
  const cookieStore = await cookies();
  cookieStore.set('userId', data.id.toString(), { httpOnly: true, secure: true });

  redirect('/');
}
