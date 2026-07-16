import Link from 'next/link';

import HistoryDetails from '@/components/HistoryDetails/HistoryDetails';
import HistoryList from '@/components/HistoryList/HistoryList';
import { db } from '@/lib/db';
import type { RequestHistory } from '@/types/history';

interface Props {
  searchParams: Promise<{ id?: string }>;
  userId: string;
}

export default async function HistoryPage({ searchParams, userId }: Props) {
  const { id } = await searchParams;
  let requests: RequestHistory[] = [];
  let error: string | null = null;

  try {
    requests = await db.query.requests.findMany(userId);
  } catch (_) {
    error = 'Failed to load history. Please try again later.';
  }
  const selected = requests.find((item) => item.id === Number(id)) || null;

  return (
    <div className="history">
      <div className="history-wrapper-large">
        <h2 className="history-title">History</h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="history-wrapper">
            <div className="history-list-container">
              <HistoryList requests={requests} selectedId={selected?.id || null} />
            </div>
            <div className="history-details-container">
              {selected && <HistoryDetails item={selected} />}
            </div>
          </div>
        )}
      </div>
      <Link className="history-back" href="/">
        ← Back to Main page
      </Link>
    </div>
  );
}
