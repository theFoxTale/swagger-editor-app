import { redirect } from 'next/navigation';

import HistoryDetails from '@/components/HistoryDetails/HistoryDetails';
import HistoryList from '@/components/HistoryList/HistoryList';
import { db } from '@/lib/db';

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function HistoryPage({ searchParams }: Props) {
  const isAuthenticated = true;
  if (!isAuthenticated) {
    redirect('/auth/sign-in');
  }
  const { id } = await searchParams;

  const requests = await db.query.requests.findMany();
  console.log('Requests from Supabase:', requests);
  const selected = requests.find((item) => item.id === Number(id)) || null;

  return (
    <div className="history">
      <h2 className="history-title">History</h2>

      <div className="history-wrapper">
        <div className="history-list-container">
          <HistoryList requests={requests} selectedId={selected?.id || null} />
        </div>
        <div className="history-details-container">
          {selected && <HistoryDetails item={selected} />}
        </div>
      </div>
    </div>
  );
}
