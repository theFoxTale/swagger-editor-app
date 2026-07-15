'use client';

import { useState } from 'react';

import { useTranslation, useTryItOutState } from '@/hooks';
import type { Operation } from '@/lib/openapi';
import { buildProxyPayload, executeProxyRequest, type ProxyResponse } from '@/lib/proxy';

import { TryItOutActions } from '../TryItOutActions';
import { TryItOutBodyEditor } from '../TryItOutBodyEditor';
import { TryItOutHeadersEditor } from '../TryItOutHeadersEditor';
import { TryItOutParameterInputs } from '../TryItOutParameterInputs';
import styles from './TryItOutForm.module.css';

export interface TryItOutFormProps {
  operation: Operation;
  document?: Record<string, unknown> | null;
  serverUrl?: string | null;
}

export const TryItOutForm = ({
  operation,
  document = null,
  serverUrl = null,
}: TryItOutFormProps) => {
  const { viewerLang } = useTranslation();
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
    getSnapshot,
    isBodyValid,
  } = useTryItOutState({ operation, document });

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ProxyResponse | null>(null);

  const sendDisabledReason = !serverUrl
    ? viewerLang.tryItOutNoServerUrl
    : !isBodyValid
      ? viewerLang.tryItOutBodyInvalidJson
      : undefined;

  const handleClear = () => {
    clear();
    setSendError(null);
    setLastResponse(null);
  };

  const handleSend = async () => {
    if (!serverUrl || sending) {
      return;
    }

    setSending(true);
    setSendError(null);
    setLastResponse(null);

    const payloadResult = buildProxyPayload({
      operation,
      serverUrl,
      snapshot: getSnapshot(),
      origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    });

    if (!payloadResult.ok) {
      setSendError(payloadResult.error);
      setSending(false);
      return;
    }

    const result = await executeProxyRequest(payloadResult.payload);
    setLastResponse(result);

    if (!result.ok) {
      setSendError(result.error || viewerLang.tryItOutSendError);
    }

    setSending(false);
  };

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
      <TryItOutActions
        sendDisabled={Boolean(sendDisabledReason)}
        sending={sending}
        onSend={() => {
          void handleSend();
        }}
        onClear={handleClear}
        sendDisabledHint={sendDisabledReason}
      />

      {sendError ? (
        <p className={styles.error} role="alert">
          {sendError}
        </p>
      ) : null}

      {lastResponse?.ok ? (
        <p className={styles.status} role="status">
          {lastResponse.status} {lastResponse.statusText} · {lastResponse.durationMs}ms
        </p>
      ) : null}
    </>
  );
};
