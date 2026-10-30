// src/types/index.ts
export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  sourceUrl: string;
  category: FashionCategory;
  tags?: string[];
  readTime?: number;
}

export type FashionCategory =
  | 'all'
  | 'runway'
  | 'streetstyle'
  | 'beauty'
  | 'luxury'
  | 'sustainability'
  | 'trends';

export interface FeedSource {
  name: string;
  url: string;
  category: FashionCategory;
  logo?: string;
}

export interface ReaderContent {
  title: string;
  content: string;
  author?: string;
  publishedAt?: string;
  imageUrl?: string;
}
