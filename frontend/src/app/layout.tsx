import type {Metadata} from 'next';
import './globals.css';
import Header from '@/components/Header/Header';

export const metadata: Metadata = {
  title: 'receipe-book',
  description: 'Receipe book',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
