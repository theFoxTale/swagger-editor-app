'use client';

import { useRouter } from 'next/navigation';

export default function CloseHistoryBtn() {
  const router = useRouter();
  return <button onClick={() => router.push('/history')}>Close</button>;
}
