'use client';
// src/components/CategoryFilter.tsx
import { CATEGORIES } from '@/lib/feeds';
import { FashionCategory } from '@/types';
import clsx from 'clsx';

interface CategoryFilterProps {
  active: FashionCategory;
  onChange: (cat: FashionCategory) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide py-4">
      <div className="flex gap-2 min-w-max px-4 sm:px-6 max-w-7xl mx-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
              active === cat.id
                ? 'bg-fashion-gold text-fashion-black shadow-lg shadow-fashion-gold/20'
                : 'bg-white/5 text-fashion-gray hover:bg-white/10 hover:text-fashion-white border border-white/10'
            )}
          >
            <span>{cat.emoji}</span>
            <span className="hidden sm:inline">{cat.labelVi}</span>
            <span className="sm:hidden">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
