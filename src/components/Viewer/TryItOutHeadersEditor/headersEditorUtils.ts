export interface HeaderEntry {
  id: string;
  name: string;
  value: string;
  locked?: boolean; //для полей по умолчанию: запрет на удаление / изменение
}

export const ACCEPT_HEADER_ID = 'accept';
export const AUTHORIZATION_HEADER_ID = 'authorization';

export const createDefaultHeaders = (): HeaderEntry[] => [
  {
    id: ACCEPT_HEADER_ID,
    name: 'Accept',
    value: 'application/json',
    locked: true,
  },
  {
    id: AUTHORIZATION_HEADER_ID,
    name: 'Authorization',
    value: '',
    locked: true,
  },
];

/**
 * Преобразует строки редактора в карту заголовков.
 * Пустые имена/значения пропускаются.
 */
export const headersToRecord = (headers: HeaderEntry[]): Record<string, string> => {
  const record: Record<string, string> = {};

  for (const header of headers) {
    const name = header.name.trim();
    const value = header.value.trim();
    if (!name || !value) {
      continue;
    }
    record[name] = header.value;
  }

  return record;
};

let customHeaderCounter = 0;

export const createCustomHeader = (): HeaderEntry => {
  customHeaderCounter += 1;
  return {
    id: `custom-${customHeaderCounter}`,
    name: '',
    value: '',
  };
};
