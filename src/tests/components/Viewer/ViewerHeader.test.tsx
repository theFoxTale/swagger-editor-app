import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ViewerHeader } from '@/components/Viewer/ViewerHeader';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      baseUrl: 'Base URL',
      baseUrlLinkLabel: 'Open base URL {url} in a new tab',
      noBaseUrl: 'No server URL defined in this schema.',
      noDescription: 'No description provided.',
      versionLabel: 'Version {version}',
    },
  }),
}));

describe('ViewerHeader', () => {
  it('renders title, version, description, and base URL link', () => {
    render(
      <ViewerHeader
        title="Pet Store API"
        version="1.0.0"
        description="Sample Pet Store API"
        serverUrl="https://api.example.com"
      />
    );

    expect(screen.getByRole('heading', { name: 'Pet Store API' })).toBeInTheDocument();
    expect(screen.getByLabelText('Version 1.0.0')).toHaveTextContent('1.0.0');
    expect(screen.getByText('Sample Pet Store API')).toBeInTheDocument();
    expect(screen.getByText('Base URL:')).toBeInTheDocument();

    const link = screen.getByRole('link', {
      name: 'Open base URL https://api.example.com in a new tab',
    });
    expect(link).toHaveAttribute('href', 'https://api.example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows fallbacks when description and server URL are missing', () => {
    render(<ViewerHeader title="Empty Info" version="0.1.0" serverUrl={null} />);

    expect(screen.getByText('No description provided.')).toBeInTheDocument();
    expect(screen.getByText('No server URL defined in this schema.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
