// src/lib/reader.ts
import { ReaderContent } from '@/types';

function stripScripts(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

function extractMainContent(html: string): string {
  // Remove unwanted sections
  const cleaned = html
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<div[^>]*class=["'][^"']*(ad|ads|advert|banner|sidebar|social|share|comment|related|newsletter|popup|modal|cookie)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');

  // Try to find article content
  const selectors = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]*class=["'][^"']*(article-body|post-content|entry-content|content-body|story-body|article-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const selector of selectors) {
    const match = cleaned.match(selector);
    if (match) {
      return match[match.length - 1];
    }
  }

  return cleaned;
}

function extractMeta(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return '';
}

function htmlToReadable(html: string): string {
  return html
    .replace(/<h[1-6][^>]*>/gi, '\n\n**')
    .replace(/<\/h[1-6]>/gi, '**\n\n')
    .replace(/<p[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<ul[^>]*>|<\/ul>|<ol[^>]*>|<\/ol>/gi, '\n')
    .replace(/<blockquote[^>]*>/gi, '\n\n> ')
    .replace(/<\/blockquote>/gi, '\n\n')
    .replace(/<strong[^>]*>|<b[^>]*>/gi, '**')
    .replace(/<\/strong>|<\/b>/gi, '**')
    .replace(/<em[^>]*>|<i[^>]*>/gi, '_')
    .replace(/<\/em>|<\/i>/gi, '_')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function fetchReaderContent(url: string): Promise<ReaderContent> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; FashionNewsReader/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();

    const cleaned = stripScripts(html);

    const title =
      extractMeta(cleaned, 'og:title') ||
      (cleaned.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? 'Article');

    const imageUrl = extractMeta(cleaned, 'og:image');
    const author =
      extractMeta(cleaned, 'author') ||
      extractMeta(cleaned, 'article:author');
    const publishedAt = extractMeta(cleaned, 'article:published_time');

    const mainContent = extractMainContent(cleaned);
    const content = htmlToReadable(mainContent);

    return {
      title: title.trim(),
      content: content || 'Content could not be extracted. Please visit the original article.',
      author: author || undefined,
      publishedAt: publishedAt || undefined,
      imageUrl: imageUrl?.startsWith('http') ? imageUrl : undefined,
    };
  } catch (error) {
    throw new Error(`Failed to fetch reader content: ${(error as Error).message}`);
  }
}
