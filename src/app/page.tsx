'use client';
// src/app/page.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import ArticleGrid from '@/components/ArticleGrid';
import ReaderModal from '@/components/ReaderModal';
import { Article, FashionCategory } from '@/types';
import { RefreshCw, ChevronDown } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<FashionCategory>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchArticles = useCallback(
    async (cat: FashionCategory, q: string, pg: number, append = false) => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      if (!append) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams({
          category: cat,
          search: q,
          page: String(pg),
          limit: '24',
        });
        const res = await fetch(`/api/articles?${params}`, {
          signal: abortRef.current.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        setArticles((prev) => append ? [...prev, ...data.articles] : data.articles);
        setHasMore(data.hasMore);
        setLastUpdated(new Date());
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Initial + category/search change
  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchArticles(category, search, 1, false);
  }, [category, search, fetchArticles]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(category, search, nextPage, true);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchArticles(category, search, 1, false);
  };

  return (
    <div className="min-h-screen bg-fashion-black">
      <Header onSearch={setSearch} />
      <CategoryFilter active={category} onChange={setCategory} />

      {/* Status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-2">
        <p className="text-xs text-fashion-gray">
          {!loading && articles.length > 0 && (
            <>
              <span className="text-fashion-gold font-medium">{articles.length}</span> bài viết
              {search && (
                <> cho &ldquo;<span className="text-fashion-white">{search}</span>&rdquo;</>
              )}
            </>
          )}
        </p>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-fashion-gray/60">
              Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-fashion-gray hover:text-fashion-gold transition-colors disabled:opacity-40"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Gold divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-2">
        <div className="h-px gold-line opacity-20" />
      </div>

      <main>
        <ArticleGrid
          articles={articles}
          onReadMode={setSelectedArticle}
          loading={loading}
        />

        {/* Load More */}
        {!loading && hasMore && articles.length > 0 && (
          <div className="flex justify-center pb-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-fashion-gold/40 text-sm text-fashion-gold hover:bg-fashion-gold hover:text-fashion-black transition-all duration-200 disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  Tải thêm
                </>
              )}
            </button>
          </div>
        )}

        {!loading && !hasMore && articles.length > 0 && (
          <p className="text-center text-xs text-fashion-gray/50 pb-12">
            ✦ Đã hiển thị tất cả bài viết ✦
          </p>
        )}
      </main>

      {/* Reader Modal */}
      <ReaderModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}
