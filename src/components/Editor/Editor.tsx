'use client';

import { useTranslation } from '@/hooks';

export const Editor = () => {
  const { editorLang } = useTranslation();
  return <div>{editorLang.title}</div>;
};
