import Link from 'next/link';

import { RequestHistory } from '@/types/history';
import './HistoryItem.css';

interface Props {
  item: RequestHistory;
  isSelected: boolean;
}

export default function HistoryItem({ item, isSelected }: Props) {
  return (
    <li className={`history-item ${isSelected ? 'history-item-selected' : ''}`}>
      <Link href={isSelected ? '/history' : `/history?id=${item.id}`} className="history-item-link">
        <span className="history-item-cell history-item-timestamp">
          {new Date(item.timestamp).toString()}
        </span>
        <span className="history-item-cell history-item-method">{item.method}</span>
        <span className="history-item-cell history-item-endpoint">{item.endpoint}</span>
        <span className="history-item-cell history-item-status">{item.status}</span>
        <span className="history-item-cell history-item-duration">{item.request_duration}ms</span>
        <span className="history-item-cell history-item-req-size">{item.request_size}B</span>
        <span className="history-item-cell history-item-res-size">{item.response_size}B</span>
        <span className="history-item-cell history-item-error">{item.error || '—'}</span>
      </Link>
    </li>
  );
}
