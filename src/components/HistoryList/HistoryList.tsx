import Link from 'next/link';

import { RequestHistory } from '@/types/history';

import HistoryItem from '../HistoryItem/HistoryItem';
import './HistoryList.css';

interface Props {
  requests: RequestHistory[];
  selectedId: number | null;
}
export default function HistoryList({ requests, selectedId }: Props) {
  if (requests.length === 0) {
    return (
      <div className="history-empty">
        <p>No executed requests yet</p>
        <p>
          <Link className="history-back" href="/">
            Go to Editor
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div className="history-list">
      <div className="history-list-header">
        <span>Timestamp</span>
        <span>Method</span>
        <span>Endpoint</span>
        <span>Status</span>
        <span>Duration</span>
        <span>Req Size</span>
        <span>Res Size</span>
        <span>Error</span>
      </div>

      <ul className="history-list-body">
        {requests.map((item) => (
          <HistoryItem item={item} key={item.id} isSelected={selectedId === item.id} />
        ))}
      </ul>
    </div>
  );
}
