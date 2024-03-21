import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modular System Configuration',
  description: 'IOEM Submission',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='px-24 py-8'>
          <h1 className='text-xl font-semibold'>Configuration Tool</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
