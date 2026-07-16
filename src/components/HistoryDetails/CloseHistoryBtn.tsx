'use client';

import { useRouter } from 'next/navigation';
import './CloseHistoryBtn.css';

export default function CloseHistoryBtn() {
  const router = useRouter();
  return (
    <button className="close-history-btn" onClick={() => router.push('/history')}>
      ✕
    </button>
  );
}
