import { describe, expect, it } from 'vitest';

import { formatMessage } from '@/lib/i18n';

describe('formatMessage', () => {
  it('replaces placeholders with provided values', () => {
    expect(formatMessage('Tag group: {name}', { name: 'pet' })).toBe('Tag group: pet');
    expect(formatMessage('{method} {path}', { method: 'GET', path: '/pets' })).toBe('GET /pets');
    expect(formatMessage('{count} operations', { count: 5 })).toBe('5 operations');
  });
});
