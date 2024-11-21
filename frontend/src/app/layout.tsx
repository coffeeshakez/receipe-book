import './globals.css';
import { Inter } from 'next/font/google';

import QueryProvider from '@/providers/QueryClientProvider';
import Header from '@/components/Header/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Recipe Book',
  description: 'A simple recipe book application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Header />
          <main className="container">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
