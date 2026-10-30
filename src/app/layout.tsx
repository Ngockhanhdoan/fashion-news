// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fashion Hub | Tin tức thời trang',
  description: 'Tổng hợp tin tức & nội dung chuyên sâu về thời trang từ các nguồn uy tín hàng đầu thế giới.',
  keywords: 'thời trang, fashion, runway, beauty, streetstyle, luxury, xu hướng',
  openGraph: {
    title: 'Fashion Hub',
    description: 'Tin tức thời trang chuyên sâu từ các nguồn uy tín',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
