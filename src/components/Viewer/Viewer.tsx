'use client';

import { useTranslation } from '@/hooks';

export const Viewer = () => {
  const { viewerLang } = useTranslation();
  return <div>{viewerLang.title}</div>;
};
