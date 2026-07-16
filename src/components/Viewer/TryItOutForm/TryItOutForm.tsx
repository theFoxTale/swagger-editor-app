'use client';

import { useState } from 'react';

import { useTranslation, useTryItOutState } from '@/hooks';
import type { Operation } from '@/lib/openapi';
import {
  buildProxyPayload,
  executeProxyRequest,
  generateCurl,
  isProxyTransportError,
  type ProxyResponse,
} from '@/lib/proxy';

import { ResponsePanel } from '../ResponsePanel';
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
  const [copyingCurl, setCopyingCurl] = useState(false);
  const [copyCurlSuccess, setCopyCurlSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ProxyResponse | null>(null);

  const sendDisabledReason = !serverUrl
    ? viewerLang.tryItOutNoServerUrl
    : !isBodyValid
      ? viewerLang.tryItOutBodyInvalidJson
      : undefined;

  const handleClear = () => {
    clear();
    setCopyCurlSuccess(false);
    setSendError(null);
    setLastResponse(null);
  };

  const handleCopyCurl = async () => {
    if (!serverUrl || copyingCurl) {
      return;
    }

    setCopyingCurl(true);
    setCopyCurlSuccess(false);
    setSendError(null);

    const payloadResult = buildProxyPayload({
      operation,
      serverUrl,
      snapshot: getSnapshot(),
      origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    });

    if (!payloadResult.ok) {
      setSendError(payloadResult.error);
      setCopyingCurl(false);
      return;
    }

    if (!navigator.clipboard?.writeText) {
      setSendError(viewerLang.tryItOutCopyCurlError);
      setCopyingCurl(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(generateCurl(payloadResult.payload));
      setCopyCurlSuccess(true);
    } catch {
      setSendError(viewerLang.tryItOutCopyCurlError);
    } finally {
      setCopyingCurl(false);
    }
  };

  const handleSend = async () => {
    if (!serverUrl || sending) {
      return;
    }

    setSending(true);
    setCopyCurlSuccess(false);
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

    // Upstream 4xx/5xx are shown in ResponsePanel; only proxy/transport failures use the alert.
    if (isProxyTransportError(result)) {
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
        copyCurlDisabled={Boolean(sendDisabledReason)}
        copyingCurl={copyingCurl}
        copyCurlSuccess={copyCurlSuccess}
        onSend={() => {
          void handleSend();
        }}
        onCopyCurl={() => {
          void handleCopyCurl();
        }}
        onClear={handleClear}
        sendDisabledHint={sendDisabledReason}
      />

      {sendError ? (
        <p className={styles.error} role="alert">
          {sendError}
        </p>
      ) : null}

      {lastResponse?.ok ? <ResponsePanel response={lastResponse} /> : null}
    </>
  );
};
