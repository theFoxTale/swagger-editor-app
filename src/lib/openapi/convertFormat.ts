import { dump } from 'js-yaml';

import { parseSchemaContent } from './parseSchema';
import type { SchemaFormat } from './types';

export const convertFormat = (content: string, from: SchemaFormat, to: SchemaFormat): string => {
  const parsed = parseSchemaContent(content, from);

  if (!parsed.data) {
    throw new Error(parsed.error ?? 'Cannot convert invalid schema');
  }

  if (to === 'json') {
    return `${JSON.stringify(parsed.data, null, 2)}\n`;
  }

  const formatted = dump(parsed.data, { lineWidth: -1, noRefs: true });
  return formatted.endsWith('\n') ? formatted : `${formatted}\n`;
};
