import type { ProxyRequestPayload } from './types';

const escapeShellValue = (value: string): string => `'${value.replace(/'/g, `'\"'\"'`)}'`;

export const generateCurl = (payload: ProxyRequestPayload): string => {
  const parts = ['curl', '-X', payload.method.toUpperCase(), escapeShellValue(payload.url)];

  for (const [name, value] of Object.entries(payload.headers ?? {})) {
    if (!name.trim() || !value.trim()) {
      continue;
    }

    parts.push('-H', escapeShellValue(`${name}: ${value}`));
  }

  if (payload.body !== undefined && payload.body !== null && payload.body.trim()) {
    parts.push('--data-raw', escapeShellValue(payload.body));
  }

  return parts.join(' ');
};
