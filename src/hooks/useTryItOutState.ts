'use client';

import { useState } from 'react';

import {
  getDefaultRequestBodyContentType,
  getInitialRequestBodyText,
  isJsonContentType,
  isValidJsonText,
} from '@/components/Viewer/TryItOutBodyEditor/bodyEditorUtils';

import {
  createDefaultHeaders,
  headersToRecord,
  type HeaderEntry,
} from '@/components/Viewer/TryItOutHeadersEditor/headersEditorUtils';

import {
  createInitialParameterValues,
  type ParameterValues,
} from '@/components/Viewer/TryItOutParameterInputs/parameterInputUtils';
import type { Operation } from '@/lib/openapi';

export interface TryItOutStateSnapshot {
  parameters: ParameterValues;
  headers: Record<string, string>;
  contentType: string;
  body: string;
}

export interface UseTryItOutStateOptions {
  operation: Operation;
  document?: Record<string, unknown> | null;
}

export interface UseTryItOutStateResult {
  parameters: ParameterValues;
  headers: HeaderEntry[];
  contentType: string;
  body: string;
  setParameters: (values: ParameterValues) => void;
  setHeaders: (headers: HeaderEntry[]) => void;
  setContentType: (contentType: string) => void;
  setBody: (body: string) => void;
  clear: () => void;
  getSnapshot: () => TryItOutStateSnapshot;
  isBodyValid: boolean;
}

const createInitialState = (operation: Operation, document: Record<string, unknown> | null) => {
  const contentType = getDefaultRequestBodyContentType(operation.requestBody);

  return {
    parameters: createInitialParameterValues(operation.parameters, document),
    headers: createDefaultHeaders(),
    contentType,
    body: getInitialRequestBodyText(operation.requestBody, contentType, document),
  };
};

export const useTryItOutState = ({
  operation,
  document = null,
}: UseTryItOutStateOptions): UseTryItOutStateResult => {
  const [state, setState] = useState(() => createInitialState(operation, document));

  const setParameters = (parameters: ParameterValues) => {
    setState((current) => ({ ...current, parameters }));
  };

  const setHeaders = (headers: HeaderEntry[]) => {
    setState((current) => ({ ...current, headers }));
  };

  const setBody = (body: string) => {
    setState((current) => ({ ...current, body }));
  };

  const setContentType = (contentType: string) => {
    setState((current) => ({
      ...current,
      contentType,
      body: getInitialRequestBodyText(operation.requestBody, contentType, document),
    }));
  };

  const clear = () => {
    setState(createInitialState(operation, document));
  };

  const getSnapshot = (): TryItOutStateSnapshot => ({
    parameters: state.parameters,
    headers: headersToRecord(state.headers),
    contentType: state.contentType,
    body: state.body,
  });

  const isBodyValid =
    !state.contentType || !isJsonContentType(state.contentType) || isValidJsonText(state.body);

  return {
    parameters: state.parameters,
    headers: state.headers,
    contentType: state.contentType,
    body: state.body,
    setParameters,
    setHeaders,
    setContentType,
    setBody,
    clear,
    getSnapshot,
    isBodyValid,
  };
};
