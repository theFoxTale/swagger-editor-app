import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase-server';

const HistoryPage = dynamic(() => import('@/components/HistoryPage/HistoryPage'), { ssr: true });

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function HistoryPageContainer({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return <HistoryPage searchParams={searchParams} userId={user.id} />;
}
