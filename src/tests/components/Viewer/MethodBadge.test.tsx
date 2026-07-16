import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MethodBadge } from '@/components/Viewer/MethodBadge';
import { HTTP_METHODS } from '@/lib/openapi';

describe('MethodBadge', () => {
  it.each(HTTP_METHODS)('renders uppercase label for %s', (method) => {
    render(<MethodBadge method={method} />);

    expect(screen.getByText(method.toUpperCase())).toBeInTheDocument();
  });

  it('applies an optional className', () => {
    const { container } = render(<MethodBadge method="get" className="extra" />);

    expect(container.firstChild).toHaveClass('extra');
  });
});
