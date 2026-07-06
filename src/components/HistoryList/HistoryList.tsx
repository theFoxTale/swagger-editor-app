import { RequestHistory } from '@/types/history';

import HistoryItem from '../HistoryItem/HistoryItem';
import './HistoryList.css';

interface Props {
  requests: RequestHistory[];
  selectedId: number | null;
}
export default function HistoryList({ requests, selectedId }: Props) {
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
