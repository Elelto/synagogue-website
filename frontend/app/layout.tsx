'use client';

import './globals.css'
import { Frank_Ruhl_Libre } from 'next/font/google'
import { Navbar } from '../components/shared/Navbar'
import Footer from '../components/Footer'
import { metadata } from './metadata'
import React from 'react';
import PageTransition from '@/components/PageTransition'
import { Providers } from './providers';
import { usePathname } from 'next/navigation';

const frankRuhlLibre = Frank_Ruhl_Libre({ 
  subsets: ['hebrew'],
  weight: ['300', '400', '500', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="he" dir="rtl" className={frankRuhlLibre.className}>
      <body suppressHydrationWarning={true}>
        <Providers>
          {!isAdminPage && <Navbar />}
          <main className="pt-16 pb-20">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
