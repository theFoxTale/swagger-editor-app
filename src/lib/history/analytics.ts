import type { SupabaseClient } from '@supabase/supabase-js';

import type { ProxyRequestPayload, ProxyResponse } from '@/lib/proxy';
import type { RequestHistory } from '@/types/history';

export type RequestHistoryInsert = Omit<RequestHistory, 'id'>;

export const getUtf8ByteLength = (value: string): number => new TextEncoder().encode(value).length;

export const estimateRequestSize = (payload: ProxyRequestPayload): number => {
  const headerSize = Object.entries(payload.headers ?? {}).reduce(
    (total, [name, value]) => total + getUtf8ByteLength(name) + getUtf8ByteLength(value),
    0
  );
  const bodySize = payload.body ? getUtf8ByteLength(payload.body) : 0;

  return getUtf8ByteLength(payload.method) + getUtf8ByteLength(payload.url) + headerSize + bodySize;
};

export const buildRequestHistoryRecord = ({
  userId,
  payload,
  result,
}: {
  userId: string;
  payload: ProxyRequestPayload;
  result: ProxyResponse;
}): RequestHistoryInsert => {
  if (result.ok) {
    return {
      user_id: userId,
      timestamp: new Date().toISOString(),
      method: payload.method.toUpperCase(),
      endpoint: payload.url,
      status: result.status,
      request_duration: result.durationMs,
      request_size: estimateRequestSize(payload),
      response_size: getUtf8ByteLength(result.body),
      error: result.status >= 400 ? result.statusText || `HTTP ${result.status}` : null,
    };
  }

  return {
    user_id: userId,
    timestamp: new Date().toISOString(),
    method: payload.method.toUpperCase(),
    endpoint: payload.url,
    status: 0,
    request_duration: result.durationMs,
    request_size: estimateRequestSize(payload),
    response_size: 0,
    error: result.error,
  };
};

export const recordRequestAnalytics = async (
  supabase: SupabaseClient,
  record: RequestHistoryInsert
): Promise<void> => {
  const { error } = await supabase.from('request_history').insert(record);

  if (error) {
    console.error('Failed to record request analytics:', error.message);
  }
};
