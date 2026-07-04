import 'server-only';

const mockRequests = [
  {
    id: 1,
    method: 'GET',
    endpoint: '/users',
    status: 200,
    duration: 45,
    timestamp: '2026-07-04T10:00:00Z',
  },
  {
    id: 2,
    method: 'POST',
    endpoint: '/users',
    status: 201,
    duration: 120,
    timestamp: '2026-07-04T09:55:00Z',
  },
  {
    id: 3,
    method: 'DELETE',
    endpoint: '/users/5',
    status: 404,
    duration: 30,
    timestamp: '2026-07-04T09:50:00Z',
  },
];

export const db = {
  query: {
    requests: {
      findMany: () => {
        return mockRequests;
      },
    },
  },
};
