import { RequestHistory } from '@/types/history';

import HistoryItem from '../HistoryItem/HistoryItem';
import './HistoryList.css';

interface Props {
  requests: RequestHistory[];
  selectedId: number | null;
}
export default function HistoryList({ requests, selectedId }: Props) {
  return (
    <ul>
      {requests.map((item) => (
        <HistoryItem item={item} key={item.id} isSelected={selectedId === item.id} />
      ))}
    </ul>
  );
}
