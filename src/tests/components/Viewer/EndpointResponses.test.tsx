import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EndpointResponses } from '@/components/Viewer/EndpointResponses';
import type { ResponseObject } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      responsesTitle: 'Responses',
      responsesEmpty: 'This endpoint has no responses.',
      responseNoDescription: 'No description',
      responseContentType: 'Response content type',
      responseSchema: 'Schema',
      responseExample: 'Example',
      responseNoExample: 'No example provided for this content type.',
      responseNoSchema: 'No schema provided for this content type.',
      responseNoContent: 'No response content defined.',
      responseHeaders: 'Headers',
      parameterRequiredYes: 'Yes',
    },
  }),
}));

const responses: ResponseObject[] = [
  {
    statusCode: '404',
    description: 'Not found',
  },
  {
    statusCode: '200',
    description: 'A list of pets',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: '#/components/schemas/Pet' },
        },
        example: [{ id: '1', name: 'Rex' }],
      },
    },
    headers: {
      'X-Rate-Limit': {
        description: 'Calls remaining',
        schema: { type: 'integer' },
        required: true,
      },
    },
  },
];

describe('EndpointResponses', () => {
  it('shows empty message when there are no responses', () => {
    render(<EndpointResponses responses={[]} />);

    expect(screen.getByText('This endpoint has no responses.')).toBeInTheDocument();
  });

  it('renders sorted status codes with the first response expanded', () => {
    render(<EndpointResponses responses={responses} />);

    expect(screen.getByText('Responses')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();

    const headers = screen.getAllByRole('button', { expanded: true });
    expect(headers[0]).toHaveTextContent('200');
    expect(screen.getByText(/"name": "Rex"/)).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('X-Rate-Limit')).toBeInTheDocument();
  });

  it('can expand a response without content', async () => {
    const user = userEvent.setup();

    render(<EndpointResponses responses={responses} />);

    await user.click(screen.getByRole('button', { name: /404/ }));

    expect(screen.getByText('No response content defined.')).toBeInTheDocument();
  });
});
