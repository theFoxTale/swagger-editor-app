// Временные через document - для запуска proxy
// TODO: удалить после подключения Supabase

export const setAuthCookie = (token: string) => {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
};

export const removeAuthCookie = () => {
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
};

export const getAuthCookie = (): string | null => {
  const match = document.cookie.match(/(^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[2]) : null;
};
