import { NextResponse } from 'next/server';

import { forwardRequest, validateProxyRequest } from '@/lib/proxy';

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

  const result = await forwardRequest(validation.payload);

  if (!result.ok) {
    return NextResponse.json(result, { status: 502 });
  }

  // Upstream status (including 4xx/5xx) is returned in the JSON body for the Response panel.
  return NextResponse.json(result, { status: 200 });
}
