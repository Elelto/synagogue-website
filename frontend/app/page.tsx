import Image from 'next/image'
import { HeroSection } from '@/components/home/HeroSection'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { PrayerTimes } from '@/components/home/PrayerTimes'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      
      <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <UpcomingEvents />
        <PrayerTimes />
      </section>
      
      <section className="w-full bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 font-hebrew">ברוכים הבאים לבית הכנסת שלנו</h2>
          <p className="text-center text-lg max-w-2xl mx-auto">
            בית הכנסת שלנו הוא מקום של תפילה, לימוד וקהילה. אנו מזמינים אתכם להצטרף אלינו לתפילות ולאירועים.
          </p>
        </div>
      </section>
    </main>
  )
}
