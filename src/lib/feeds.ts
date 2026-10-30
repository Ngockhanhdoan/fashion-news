// src/lib/feeds.ts
import { FeedSource, FashionCategory } from '@/types';

export const FEED_SOURCES: FeedSource[] = [
  // Runway & High Fashion
  {
    name: 'Vogue',
    url: 'https://www.vogue.com/feed/rss',
    category: 'runway',
    logo: 'V',
  },
  {
    name: 'Harper\'s Bazaar',
    url: 'https://www.harpersbazaar.com/rss/all.xml/',
    category: 'runway',
    logo: 'HB',
  },
  {
    name: 'WWD',
    url: 'https://wwd.com/feed/',
    category: 'runway',
    logo: 'WWD',
  },
  // Street Style
  {
    name: 'Hypebeast',
    url: 'https://hypebeast.com/feed',
    category: 'streetstyle',
    logo: 'HB',
  },
  {
    name: 'Highsnobiety',
    url: 'https://www.highsnobiety.com/feed/',
    category: 'streetstyle',
    logo: 'HS',
  },
  // Beauty
  {
    name: 'Allure',
    url: 'https://www.allure.com/feed/rss',
    category: 'beauty',
    logo: 'AL',
  },
  {
    name: 'Byrdie',
    url: 'https://www.byrdie.com/rss',
    category: 'beauty',
    logo: 'BY',
  },
  // Luxury
  {
    name: 'Business of Fashion',
    url: 'https://www.businessoffashion.com/rss',
    category: 'luxury',
    logo: 'BoF',
  },
  {
    name: 'Robb Report',
    url: 'https://robbreport.com/feed/',
    category: 'luxury',
    logo: 'RR',
  },
  // Sustainability
  {
    name: 'Good On You',
    url: 'https://goodonyou.eco/feed/',
    category: 'sustainability',
    logo: 'GOY',
  },
  // Trends
  {
    name: 'Who What Wear',
    url: 'https://www.whowhatwear.com/rss',
    category: 'trends',
    logo: 'WWW',
  },
  {
    name: 'InStyle',
    url: 'https://www.instyle.com/rss/all.xml',
    category: 'trends',
    logo: 'IS',
  },
];

export const CATEGORIES: { id: FashionCategory; label: string; labelVi: string; emoji: string }[] = [
  { id: 'all', label: 'All', labelVi: 'Tất cả', emoji: '✦' },
  { id: 'runway', label: 'Runway', labelVi: 'Sàn diễn', emoji: '👗' },
  { id: 'streetstyle', label: 'Street Style', labelVi: 'Thời trang đường phố', emoji: '🧢' },
  { id: 'beauty', label: 'Beauty', labelVi: 'Làm đẹp', emoji: '💄' },
  { id: 'luxury', label: 'Luxury', labelVi: 'Xa xỉ', emoji: '💎' },
  { id: 'sustainability', label: 'Sustainability', labelVi: 'Bền vững', emoji: '🌿' },
  { id: 'trends', label: 'Trends', labelVi: 'Xu hướng', emoji: '🔥' },
];
