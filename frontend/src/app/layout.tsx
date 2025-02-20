import './globals.css'
import { Frank_Ruhl_Libre } from 'next/font/google'
import { Navbar } from '@/components/shared/Navbar'
import { Metadata } from 'next'

const frankRuhlLibre = Frank_Ruhl_Libre({ 
  subsets: ['hebrew'],
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'בית הכנסת חזון יוסף',
  description: 'אתר בית הכנסת חזון יוסף - מקום של תפילה, לימוד וקהילה',
  icons: {
    icon: '/images/logo-removebg-preview.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={frankRuhlLibre.className}>
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                document.body.removeAttribute('data-new-gr-c-s-check-loaded');
                document.body.removeAttribute('data-gr-ext-installed');
              });
            `
          }}
        />
      </head>
      <body className="bg-[#FFFAF0]">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
