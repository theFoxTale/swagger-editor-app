import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const HistoryPage = dynamic(() => import('@/components/HistoryPage/HistoryPage'), { ssr: true });

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function HistoryPageContainer({ searchParams }: Props) {
  const isAuthenticated = true;
  if (!isAuthenticated) {
    redirect('/');
  }

  return <HistoryPage searchParams={searchParams} />;
}
