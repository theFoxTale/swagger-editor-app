'use client';

import { useTranslation } from '@/hooks';

export const HistoryTitle = () => {
  const { historyLang } = useTranslation();

  return <h2 className="history-title">{historyLang.title}</h2>;
};
