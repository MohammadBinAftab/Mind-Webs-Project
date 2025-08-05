import './globals.css';
import type { Metadata } from 'next';

import localFont from 'next/font/local'

const inter = localFont({
  src: './fonts/Inter-Regular.woff2',
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'Geospatial Analytics Dashboard',
  description: 'Interactive mapping with temporal data analysis and polygon drawing tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}