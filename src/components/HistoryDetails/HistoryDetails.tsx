import CloseHistoryBtn from './CloseHistoryBtn';

import './HistoryDetails.css';
import { RequestHistory } from '@/types/history';

interface Props {
  item: RequestHistory;
}

export default function HistoryDetails({ item }: Props) {
  return (
    <div className="history-details">
      <h3>Details of item {item.id}</h3>
      <CloseHistoryBtn />
    </div>
  );
}
