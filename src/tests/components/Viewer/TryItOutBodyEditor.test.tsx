import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  getInitialRequestBodyText,
  isValidJsonText,
  TryItOutBodyEditor,
} from '@/components/Viewer/TryItOutBodyEditor';
import type { RequestBody } from '@/lib/openapi';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    viewerLang: {
      tryItOutBodyTitle: 'Request body',
      tryItOutBodyEmpty: 'This endpoint has no request body.',
      tryItOutBodyContentType: 'Request body content type',
      tryItOutBodyEditor: 'Request body editor',
      tryItOutBodyInvalidJson: 'Body is not valid JSON.',
      tryItOutRequired: 'required',
      requestBodyOptional: 'Optional',
    },
  }),
}));

const createRequestBody = (overrides: Partial<RequestBody> = {}): RequestBody => ({
  required: true,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Pet' },
      example: { id: 1, name: 'Rex' },
    },
  },
  ...overrides,
});

describe('body editor utils', () => {
  it('prefills body text from the media type example', () => {
    const text = getInitialRequestBodyText(createRequestBody(), 'application/json');
    expect(text).toContain('"name": "Rex"');
  });

  it('validates JSON text', () => {
    expect(isValidJsonText('')).toBe(true);
    expect(isValidJsonText('{"a":1}')).toBe(true);
    expect(isValidJsonText('{')).toBe(false);
  });
});

describe('TryItOutBodyEditor', () => {
  it('shows empty state when there is no request body', () => {
    render(<TryItOutBodyEditor />);

    expect(screen.getByText('This endpoint has no request body.')).toBeInTheDocument();
  });

  it('renders a textarea prefilled with the example', () => {
    render(<TryItOutBodyEditor requestBody={createRequestBody()} />);

    expect(screen.getByRole('heading', { name: 'Request body' })).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();

    const editor = screen.getByRole('textbox', { name: 'Request body editor' });
    expect(editor).toHaveValue('{\n  "id": 1,\n  "name": "Rex"\n}');
  });

  it('switches content type and reloads the example body', async () => {
    const user = userEvent.setup();

    render(
      <TryItOutBodyEditor
        requestBody={createRequestBody({
          content: {
            'application/json': { example: { kind: 'json' } },
            'application/xml': { example: '<pet />' },
          },
        })}
      />
    );

    await user.click(screen.getByRole('tab', { name: 'application/xml' }));

    expect(screen.getByRole('textbox', { name: 'Request body editor' })).toHaveValue('<pet />');
  });

  it('flags invalid JSON for JSON content types', async () => {
    const user = userEvent.setup();
    render(<TryItOutBodyEditor requestBody={createRequestBody()} />);

    const editor = screen.getByRole('textbox', { name: 'Request body editor' });
    await user.clear(editor);
    await user.type(editor, '{{broken');

    expect(screen.getByText('Body is not valid JSON.')).toBeInTheDocument();
    expect(editor).toHaveAttribute('aria-invalid', 'true');
  });

  it('supports controlled body text', async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [body, setBody] = useState('{"ok":true}');

      return (
        <TryItOutBodyEditor requestBody={createRequestBody()} body={body} onBodyChange={setBody} />
      );
    };

    render(<Controlled />);

    const editor = screen.getByRole('textbox', { name: 'Request body editor' });
    await user.clear(editor);
    await user.click(editor);
    await user.paste('{"name":"Ada"}');

    expect(editor).toHaveValue('{"name":"Ada"}');
  });
});
