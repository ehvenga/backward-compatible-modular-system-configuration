import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/navbar';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

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
        <BackgroundGradientAnimation>
          <Navbar />
          <div className='px-24 py-8'>{children}</div>
        </BackgroundGradientAnimation>
      </body>
    </html>
  );
}
