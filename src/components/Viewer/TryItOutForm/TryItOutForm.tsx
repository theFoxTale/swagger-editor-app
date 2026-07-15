'use client';

import { useTryItOutState } from '@/hooks';
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
  const {
    parameters,
    headers,
    contentType,
    body,
    setParameters,
    setHeaders,
    setContentType,
    setBody,
    clear,
  } = useTryItOutState({ operation, document });

  return (
    <>
      <TryItOutParameterInputs
        parameters={operation.parameters}
        document={document}
        values={parameters}
        onValuesChange={setParameters}
      />
      <TryItOutHeadersEditor headers={headers} onHeadersChange={setHeaders} />
      <TryItOutBodyEditor
        requestBody={operation.requestBody}
        document={document}
        contentType={contentType}
        body={body}
        onContentTypeChange={setContentType}
        onBodyChange={setBody}
      />
      <TryItOutActions onClear={clear} />
    </>
  );
};
