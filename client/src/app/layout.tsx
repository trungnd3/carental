import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Carental',
  description: 'The Renting Car system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex justify-center`}
      >
        <div className='flex flex-col min-h-screen md:max-w-[1280px] w-full mx-auto gap-16 font-[family-name:var(--font-geist-sans)]'>
          <Header />
          <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start flex-1 justify-center px-8'>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
