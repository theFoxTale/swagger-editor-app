import Link from 'next/link';

export default function HistoryItem({ item }) {
  return (
    <li className="history-item">
      <Link href={`/history?id=${item.id}`}>
        <span>id: {item.id}</span>
        <span>method:{item.method}</span>
      </Link>
    </li>
  );
}
