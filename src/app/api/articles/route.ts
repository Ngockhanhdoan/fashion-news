// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/parser';
import { FashionCategory } from '@/types';

export const runtime = 'nodejs';
export const revalidate = 300; // 5 minutes Edge Cache

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') || 'all') as FashionCategory;
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '24', 10);

  try {
    let articles = await fetchAllFeeds(category);

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }

    const total = articles.length;
    const start = (page - 1) * limit;
    const paginated = articles.slice(start, start + limit);

    return NextResponse.json(
      { articles: paginated, total, page, limit, hasMore: start + limit < total },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles', articles: [] }, { status: 500 });
  }
}
