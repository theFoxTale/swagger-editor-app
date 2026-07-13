import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import HistoryList from '@/components/HistoryList/HistoryList';

const mockRequests = [
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
  {
    id: 2,
    method: 'POST',
    endpoint: '/users',
    status: 201,
    request_duration: 120,
    timestamp: '2026-07-04T09:55:00Z',
    request_size: 200,
    response_size: 300,
    error: null,
    user_id: '1',
  },
];

describe('HistoryList', () => {
  it('show list of requests', () => {
    render(<HistoryList requests={mockRequests} selectedId={null} />);
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('show header', () => {
    render(<HistoryList requests={mockRequests} selectedId={null} />);
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Method')).toBeInTheDocument();
  });

  it('show empty message for no requests', () => {
    render(<HistoryList requests={[]} selectedId={null} />);
    expect(screen.getByText(/No executed/)).toBeInTheDocument();
  });

  it('highlight selected item', () => {
    const { container } = render(<HistoryList requests={mockRequests} selectedId={1} />);
    const selected = container.querySelector('.history-item-selected');
    expect(selected).toBeInTheDocument();
  });
});
