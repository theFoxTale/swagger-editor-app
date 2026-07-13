'use server';

import { redirect } from 'next/navigation';

import { supabase } from '@/lib/supabase';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.from('users').insert({ email, password });

  if (error) return { error: error.message };

  redirect('/auth/sign-in');
}
