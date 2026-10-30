// src/app/api/reader/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchReaderContent } from '@/lib/reader';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // Block non-HTTP(S) protocols for security
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return NextResponse.json({ error: 'Only HTTP(S) URLs are allowed' }, { status: 400 });
  }

  try {
    const content = await fetchReaderContent(url);
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch reader content' },
      { status: 500 }
    );
  }
}
