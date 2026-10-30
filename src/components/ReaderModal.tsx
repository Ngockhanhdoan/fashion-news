'use client';
// src/components/ReaderModal.tsx
import { useEffect, useState, useCallback } from 'react';
import { Article, ReaderContent } from '@/types';
import { X, ExternalLink, Clock, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ReaderModalProps {
  article: Article | null;
  onClose: () => void;
}

export default function ReaderModal({ article, onClose }: ReaderModalProps) {
  const [content, setContent] = useState<ReaderContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setContent(null);
    try {
      const res = await fetch(`/api/reader?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error('Không thể tải nội dung');
      const data: ReaderContent = await res.json();
      setContent(data);
    } catch (err) {
      setError((err as Error).message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (article) {
      fetchContent(article.url);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [article, fetchContent]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!article) return null;

  const publishDate = content?.publishedAt || article.publishedAt;
  let formattedDate = '';
  try {
    formattedDate = format(new Date(publishDate), "d MMMM yyyy", { locale: vi });
  } catch { /* ignore */ }

  const displayImage = content?.imageUrl || article.imageUrl;
  const displayTitle = content?.title || article.title;

  function renderContent(text: string) {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      if (line.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-4 border-fashion-gold pl-4 italic text-fashion-gray my-4">
            {line.slice(2)}
          </blockquote>
        );
      }
      if (line.startsWith('• ')) {
        return (
          <li key={i} className="ml-4 mb-1">
            {line.slice(2)}
          </li>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={i} className="text-lg font-bold text-fashion-white mt-6 mb-2">
            {line.slice(2, -2)}
          </h3>
        );
      }
      return <p key={i}>{line}</p>;
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#111] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fashion-gold" />
            <span className="text-xs text-fashion-gray font-medium uppercase tracking-widest">
              Chế độ đọc
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-fashion-gray hover:text-fashion-gold transition-colors"
            >
              <ExternalLink size={13} />
              Bài gốc
            </a>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-fashion-gray hover:text-fashion-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Loader2 size={28} className="text-fashion-gold animate-spin" />
              <p className="text-sm text-fashion-gray">Đang tải nội dung...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle size={28} className="text-rose-400" />
              <p className="text-sm text-fashion-gray">{error}</p>
              <p className="text-xs text-fashion-gray/60">Nội dung từ RSS feed:</p>
              <div className="w-full mt-2 text-left reader-content">
                <h2 className="text-xl font-bold text-fashion-white mb-3">{article.title}</h2>
                <p>{article.description}</p>
              </div>
            </div>
          )}

          {/* Content */}
          {content && !loading && (
            <article className="animate-fade-in">
              {/* Hero image */}
              {displayImage && (
                <div className="relative w-full h-52 rounded-xl overflow-hidden mb-6 bg-white/5">
                  <Image
                    src={displayImage}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Meta */}
              <div className="mb-1">
                <span className="text-xs text-fashion-gold font-medium uppercase tracking-widest">
                  {article.source}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-fashion-white leading-tight mb-4">
                {displayTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-fashion-gray mb-6 pb-6 border-b border-white/10">
                {content.author && <span>✍ {content.author}</span>}
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {formattedDate}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="reader-content space-y-1">
                {renderContent(content.content)}
              </div>

              {/* Footer link */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-fashion-gold hover:underline"
                >
                  Đọc bài viết đầy đủ trên {article.source}
                  <ExternalLink size={13} />
                </a>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
