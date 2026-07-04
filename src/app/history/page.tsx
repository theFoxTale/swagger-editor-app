import HistoryDetails from '@/components/HistoryDetails/HistoryDetails';
import HistoryList from '@/components/HistoryList/HistoryList';
import { db } from '@/lib/db';

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function HistoryPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const requests = await db.query.requests.findMany();
  const selected = requests.find((item) => item.id === Number(id)) || null;
  console.log(id);

  return (
    <div>
      <h2>History</h2>
      <HistoryList requests={requests} />
      {selected && <HistoryDetails item={selected} />}
    </div>
  );
}
