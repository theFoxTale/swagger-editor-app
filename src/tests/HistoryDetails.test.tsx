import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import HistoryDetails from '@/components/HistoryDetails/HistoryDetails';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockItem = {
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
};

describe('HistoryDetails', () => {
  it('renders item details', () => {
    render(<HistoryDetails item={mockItem} />);
    expect(screen.getByText(/Request #1/)).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/users')).toBeInTheDocument();
    expect(screen.getByText('45ms')).toBeInTheDocument();
  });
});
