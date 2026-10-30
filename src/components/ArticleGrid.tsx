'use client';
// src/components/ArticleGrid.tsx
import { Article } from '@/types';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  onReadMode: (article: Article) => void;
  loading?: boolean;
}

function SkeletonCard({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row h-56">
        <div className="skeleton md:w-1/2 h-48 md:h-full" />
        <div className="flex-1 p-6 flex flex-col gap-3">
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton h-6 w-full rounded" />
          <div className="skeleton h-6 w-3/4 rounded" />
          <div className="skeleton h-4 w-full rounded mt-2" />
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="flex gap-2 mt-auto">
            <div className="skeleton h-7 w-24 rounded-full" />
            <div className="skeleton h-7 w-16 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 flex flex-col gap-2">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded mt-1" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex gap-2 mt-3">
          <div className="skeleton h-7 flex-1 rounded-lg" />
          <div className="skeleton h-7 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ArticleGrid({ articles, onReadMode, loading }: ArticleGridProps) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <SkeletonCard featured />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <span className="text-6xl mb-4">✦</span>
        <h3 className="text-lg font-medium text-fashion-white mb-2">Không tìm thấy bài viết</h3>
        <p className="text-sm text-fashion-gray">Thử tìm kiếm từ khóa khác hoặc chọn danh mục khác.</p>
      </div>
    );
  }

  const [featured, ...rest] = articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Featured article */}
      {featured && (
        <div className="mb-6">
          <ArticleCard article={featured} onReadMode={onReadMode} featured />
        </div>
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} onReadMode={onReadMode} />
          ))}
        </div>
      )}
    </div>
  );
}
