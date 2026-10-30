'use client';
// src/components/ArticleCard.tsx
import { Article } from '@/types';
import { Clock, ExternalLink, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';

interface ArticleCardProps {
  article: Article;
  onReadMode: (article: Article) => void;
  featured?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  runway: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  streetstyle: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  beauty: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  luxury: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  sustainability: 'bg-green-500/20 text-green-300 border-green-500/30',
  trends: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

const CATEGORY_LABELS: Record<string, string> = {
  runway: 'Sàn diễn',
  streetstyle: 'Street Style',
  beauty: 'Làm đẹp',
  luxury: 'Xa xỉ',
  sustainability: 'Bền vững',
  trends: 'Xu hướng',
};

function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
  } catch {
    return '';
  }
}

export default function ArticleCard({ article, onReadMode, featured = false }: ArticleCardProps) {
  const catColor = CATEGORY_COLORS[article.category] || 'bg-white/10 text-white/60 border-white/10';
  const catLabel = CATEGORY_LABELS[article.category] || article.category;

  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-fashion-gold/40 transition-all duration-300 animate-slide-up">
        <div className="flex flex-col md:flex-row gap-0 h-full">
          {/* Image */}
          <div className="relative md:w-1/2 h-48 md:h-auto overflow-hidden bg-white/5">
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl opacity-20">👗</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-fashion-black/40 md:block hidden" />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${catColor}`}>
                  {catLabel}
                </span>
                <span className="text-xs text-fashion-gray">{article.source}</span>
              </div>
              <h2 className="text-xl font-bold text-fashion-white leading-tight mb-3 group-hover:text-fashion-gold transition-colors line-clamp-3">
                {article.title}
              </h2>
              <p className="text-sm text-fashion-gray leading-relaxed line-clamp-3">
                {article.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-fashion-gray">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {timeAgo(article.publishedAt)}
                </span>
                {article.readTime && (
                  <span className="flex items-center gap-1">
                    <BookOpen size={11} />
                    {article.readTime} phút đọc
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onReadMode(article)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-fashion-gold/10 text-fashion-gold border border-fashion-gold/30 hover:bg-fashion-gold hover:text-fashion-black transition-all duration-200"
                >
                  <BookOpen size={11} />
                  Đọc gọn
                </button>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-white/5 text-fashion-gray border border-white/10 hover:border-white/30 hover:text-fashion-white transition-all duration-200"
                >
                  <ExternalLink size={11} />
                  Gốc
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-fashion-gold/40 transition-all duration-300 animate-fade-in flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-white/5 flex-shrink-0">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-10">✦</span>
          </div>
        )}
        {/* Category badge on image */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border backdrop-blur-sm ${catColor}`}>
            {catLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-fashion-gold font-medium truncate">{article.source}</span>
          <span className="text-fashion-gray/30">·</span>
          <span className="text-xs text-fashion-gray flex-shrink-0">{timeAgo(article.publishedAt)}</span>
        </div>

        <h3 className="text-sm font-semibold text-fashion-white leading-snug mb-2 group-hover:text-fashion-gold transition-colors line-clamp-3 flex-1">
          {article.title}
        </h3>

        <p className="text-xs text-fashion-gray leading-relaxed line-clamp-2 mb-4">
          {article.description}
        </p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onReadMode(article)}
            className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-fashion-gold/10 text-fashion-gold border border-fashion-gold/30 hover:bg-fashion-gold hover:text-fashion-black transition-all duration-200"
          >
            <BookOpen size={11} />
            Đọc gọn
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 px-3 text-xs py-1.5 rounded-lg bg-white/5 text-fashion-gray border border-white/10 hover:border-white/30 hover:text-fashion-white transition-all duration-200"
          >
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
