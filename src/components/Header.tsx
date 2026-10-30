'use client';
// src/components/Header.tsx
import { useState } from 'react';
import { Search, Newspaper, X } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <header className="sticky top-0 z-50 bg-fashion-black border-b border-fashion-gold/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-fashion-gold rounded-sm flex items-center justify-center">
              <Newspaper size={18} className="text-fashion-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest uppercase text-fashion-white">
                Fashion<span className="text-fashion-gold">Hub</span>
              </h1>
              <p className="text-[10px] text-fashion-gray tracking-[0.3em] uppercase">
                Tin tức thời trang
              </p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 ${
                focused
                  ? 'border-fashion-gold bg-white/5 w-64'
                  : 'border-white/10 bg-white/5 w-44'
              }`}
            >
              <Search size={14} className="text-fashion-gold flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Tìm kiếm..."
                className="bg-transparent text-sm text-fashion-white placeholder-fashion-gray/60 outline-none flex-1 min-w-0"
              />
              {query && (
                <button type="button" onClick={handleClear}>
                  <X size={12} className="text-fashion-gray hover:text-fashion-white transition-colors" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Gold accent line */}
        <div className="h-px gold-line opacity-60" />
      </div>
    </header>
  );
}
