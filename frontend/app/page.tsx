import Link from 'next/link';
import { HeroSection } from '../components/home/HeroSection'
import { PrayerTimes } from '../components/home/PrayerTimes'
import { DailyTimes } from '../components/home/DailyTimes'
import { Announcements } from '../components/home/Announcements'
import { ScrollAnimation } from '../components/shared/ScrollAnimation'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#87CEEB]">
      <ScrollAnimation direction="down" delay={0.2}>
        <HeroSection />
      </ScrollAnimation>
      
      {/* Action Buttons Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" delay={0.3}>
            <div className="flex flex-col items-center gap-6 md:gap-8">
              <Link 
                href="/memorial" 
                className="inline-block px-10 py-5 text-2xl md:text-3xl font-bold text-white bg-[#C6A45C] hover:bg-[#D4AF37] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] hover:scale-105"
              >
                קנה נציב יום
              </Link>
              <Link 
                href="/donate" 
                className="inline-block px-10 py-5 text-2xl md:text-3xl font-bold text-white bg-[#C6A45C] hover:bg-[#D4AF37] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] hover:scale-105"
              >
                תרומה לבית הכנסת
              </Link>
              <Link 
                href="/gallery" 
                className="inline-block px-10 py-5 text-2xl md:text-3xl font-bold text-white bg-[#C6A45C] hover:bg-[#D4AF37] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] hover:scale-105"
              >
                גלריית תמונות
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Prayer Times, Daily Times and Announcements Section */}
      <section className="py-16 mb-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12">
            <ScrollAnimation direction="up" delay={0.4}>
              <DailyTimes />
            </ScrollAnimation>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <ScrollAnimation direction="right" delay={0.4}>
                <PrayerTimes />
              </ScrollAnimation>
              <ScrollAnimation direction="left" delay={0.4}>
                <Announcements />
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
