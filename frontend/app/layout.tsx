import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/navbar';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interactive Modular System Configuration',
  description: 'IOEM Washington DC 2024 Poster Submission',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {/* <BackgroundGradientAnimation> */}
        <div className='bg-gradient-to-b from-purple-900 to-purple-700 min-h-screen h-full'>
          <Navbar />
          <div className='px-24 py-8'>{children}</div>
        </div>
        {/* </BackgroundGradientAnimation> */}
      </body>
    </html>
  );
}
