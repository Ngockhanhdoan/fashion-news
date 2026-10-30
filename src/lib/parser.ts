// src/lib/parser.ts
import { Article, FashionCategory, FeedSource } from '@/types';
import { FEED_SOURCES } from './feeds';
import crypto from 'crypto';

interface RSSItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  'content:encoded'?: string;
  enclosure?: { url?: string };
  'media:content'?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>;
  'media:thumbnail'?: { $?: { url?: string } };
  content?: string;
  isoDate?: string;
}

function generateId(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 12);
}

function extractImageFromContent(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : undefined;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'FashionNewsHub/1.0 RSS Reader',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
      next: { revalidate: 300 }, // Cache 5 minutes on Vercel Edge
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

function parseXmlItems(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const item: RSSItem = {};

    const getTag = (tag: string): string => {
      const cdataMatch = itemXml.match(
        new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i')
      );
      if (cdataMatch) return cdataMatch[1].trim();
      const tagMatch = itemXml.match(
        new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
      );
      return tagMatch ? tagMatch[1].trim() : '';
    };

    const getLinkTag = (): string => {
      const cdataLink = getTag('link');
      if (cdataLink) return cdataLink;
      const atomLink = itemXml.match(/<link[^>]+href=["']([^"']+)["']/i);
      if (atomLink) return atomLink[1];
      return '';
    };

    const getMediaUrl = (): string => {
      const mediaContent = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
      if (mediaContent) return mediaContent[1];
      const mediaThumbnail = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
      if (mediaThumbnail) return mediaThumbnail[1];
      const enclosure = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image[^"']*["']/i);
      if (enclosure) return enclosure[1];
      const enclosure2 = itemXml.match(/<enclosure[^>]+type=["']image[^"']*["'][^>]*url=["']([^"']+)["']/i);
      if (enclosure2) return enclosure2[1];
      return '';
    };

    item.title = getTag('title');
    item.link = getLinkTag();
    item.description = getTag('description');
    item['content:encoded'] = getTag('content:encoded');
    item.pubDate = getTag('pubDate') || getTag('dc:date') || getTag('published');
    item.isoDate = item.pubDate;

    const mediaUrl = getMediaUrl();
    if (mediaUrl) {
      item['media:content'] = { $: { url: mediaUrl } };
    }

    if (item.title || item.link) {
      items.push(item);
    }
  }

  return items;
}

export async function fetchFeed(source: FeedSource): Promise<Article[]> {
  try {
    const response = await fetchWithTimeout(source.url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const items = parseXmlItems(xml);

    return items.slice(0, 15).map((item): Article => {
      const rawContent = item['content:encoded'] || item.description || '';
      const description = stripHtml(item.description || rawContent).slice(0, 300);
      const content = rawContent;

      let imageUrl: string | undefined;
      const mediaContent = item['media:content'];
      if (mediaContent) {
        if (Array.isArray(mediaContent)) {
          imageUrl = mediaContent[0]?.$?.url;
        } else {
          imageUrl = (mediaContent as { $?: { url?: string } }).$?.url;
        }
      }
      if (!imageUrl && item['media:thumbnail']) {
        imageUrl = item['media:thumbnail'].$?.url;
      }
      if (!imageUrl && content) {
        imageUrl = extractImageFromContent(content);
      }
      if (!imageUrl && item.description) {
        imageUrl = extractImageFromContent(item.description);
      }

      const url = item.link || '';
      const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();

      return {
        id: generateId(url || item.title || Math.random().toString()),
        title: stripHtml(item.title || 'Untitled'),
        description: description || 'No description available.',
        content,
        url,
        imageUrl: imageUrl?.startsWith('http') ? imageUrl : undefined,
        publishedAt: new Date(publishedAt).toISOString(),
        source: source.name,
        sourceUrl: source.url,
        category: source.category,
        readTime: estimateReadTime(description + ' ' + stripHtml(content)),
      };
    });
  } catch (error) {
    console.error(`Failed to fetch feed from ${source.name}:`, error);
    return [];
  }
}

export async function fetchAllFeeds(category?: FashionCategory): Promise<Article[]> {
  const sources = category && category !== 'all'
    ? FEED_SOURCES.filter((s) => s.category === category)
    : FEED_SOURCES;

  const results = await Promise.allSettled(sources.map(fetchFeed));
  const articles: Article[] = [];

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  });

  // Sort by published date, newest first
  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
