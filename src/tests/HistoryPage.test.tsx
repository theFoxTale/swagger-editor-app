import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLanguageStore } from '@/store';
import HistoryPage from '../components/HistoryPage/HistoryPage';

vi.mock('../lib/db', () => ({
  db: {
    query: {
      requests: {
        findMany: vi.fn(),
      },
    },
  },
}));

import { db } from '../lib/db';

describe('HistoryPage', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
  });

  it('renders history list', async () => {
    vi.mocked(db.query.requests.findMany).mockResolvedValue([
      {
        id: 1,
        method: 'GET',
        endpoint: '/users',
        status: 200,
        request_duration: 45,
        timestamp: '2026-07-04T10:00:00Z',
        request_size: 120,
        response_size: 450,
        error: null,
        user_id: '1',
      },
    ]);

    render(await HistoryPage({ searchParams: Promise.resolve({}), userId: '1' }));

    expect(screen.getByText('History & Analytics')).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(db.query.requests.findMany).toHaveBeenCalledWith('1');
  });

  it('shows error message', async () => {
    vi.mocked(db.query.requests.findMany).mockRejectedValue(new Error('DB error'));

    render(await HistoryPage({ searchParams: Promise.resolve({}), userId: '1' }));

    expect(screen.getByText(/Failed to load/)).toBeInTheDocument();
  });
});
