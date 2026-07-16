import { NextResponse } from 'next/server';

import { buildRequestHistoryRecord, recordRequestAnalytics } from '@/lib/history/analytics';
import { forwardRequest, validateProxyRequest } from '@/lib/proxy';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  const validation = validateProxyRequest(json);
  if (!validation.valid) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = await forwardRequest(validation.payload);

  if (user) {
    const record = buildRequestHistoryRecord({
      userId: user.id,
      payload: validation.payload,
      result,
    });

    await recordRequestAnalytics(supabase, record);
  }

  if (!result.ok) {
    return NextResponse.json(result, { status: 502 });
  }

  return NextResponse.json(result, { status: 200 });
}
