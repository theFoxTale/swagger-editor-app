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
      <Link href={isSelected ? '/history' : `/history?id=${item.id}`}>
        <span>id: {item.id}</span>
        <span>method:{item.method}</span>
      </Link>
    </li>
  );
}
