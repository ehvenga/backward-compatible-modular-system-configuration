import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modularization Agent',
  description:
    'A dynamic modular system configuration tool designed to optimize product design and enhance compatibility.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${manrope.className} w-full min-h-screen`}>
        <header className='text-xl px-8 py-6 bg-black text-yellow-50'>
          Modularization Agent
        </header>
        <div className='p-8'>{children}</div>
      </body>
    </html>
  );
}
