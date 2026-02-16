// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PickMe - 선택은 AI에게, 맛집은 당신에게',
  description: '평점 말고 내 취향으로! AI 기반 똑똑한 선택 도우미',
  keywords: ['선택', '투표', '맛집', '추천', '그룹 투표', 'AI', '랭킹'],
  authors: [{ name: 'PickMe Team' }],
  openGraph: {
    title: 'PickMe - 선택은 AI에게',
    description: '평점 말고 내 취향으로! AI 기반 똑똑한 선택 도우미',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
