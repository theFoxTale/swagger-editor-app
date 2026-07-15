'use client';

import { useState } from 'react';

import type { Operation } from '@/lib/openapi';

import { TryItOutActions } from '../TryItOutActions';
import { TryItOutBodyEditor } from '../TryItOutBodyEditor';
import { TryItOutHeadersEditor } from '../TryItOutHeadersEditor';
import { TryItOutParameterInputs } from '../TryItOutParameterInputs';

export interface TryItOutFormProps {
  operation: Operation;
  document?: Record<string, unknown> | null;
}

export const TryItOutForm = ({ operation, document = null }: TryItOutFormProps) => {
  const [resetKey, setResetKey] = useState(0);

  return (
    <>
      <div key={resetKey}>
        <TryItOutParameterInputs parameters={operation.parameters} document={document} />
        <TryItOutHeadersEditor />
        <TryItOutBodyEditor requestBody={operation.requestBody} document={document} />
      </div>
      <TryItOutActions onClear={() => setResetKey((current) => current + 1)} />
    </>
  );
};
