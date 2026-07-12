import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
//import { cookies } from 'next/headers';

const HistoryPage = dynamic(() => import('@/components/HistoryPage/HistoryPage'), { ssr: true });

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function HistoryPageContainer({ searchParams }: Props) {
  const isAuthenticated = true;
  if (!isAuthenticated) {
    redirect('/');
  }

  // const cookieStore = await cookies();
  // const userId = cookieStore.get('userId')?.value;

  // if (!userId) {
  //   redirect('/');
  // }

  return <HistoryPage searchParams={searchParams} />;
}
