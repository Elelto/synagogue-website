import Link from 'next/link';
import { HeroSection } from '../components/home/HeroSection'
import { PrayerTimes } from '../components/home/PrayerTimes'
import { Announcements } from '../components/home/Announcements'
import { ScrollAnimation } from '../components/shared/ScrollAnimation'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollAnimation direction="down" delay={0.2}>
        <HeroSection />
      </ScrollAnimation>
      
      {/* Gallery Button Section */}
      <section className="py-16 bg-[#FFFAF0]">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" delay={0.3}>
            <div className="text-center">
              <Link 
                href="/memorial" 
                className="inline-block px-8 py-4 text-xl font-bold text-white bg-[#8B4513] hover:bg-[#B8860B] rounded-lg shadow-lg transition-colors duration-300"
              >
                קנה נציב יום
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Prayer Times and Announcements Section */}
      <section className="py-16 mb-16 bg-[#FFFAF0]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollAnimation direction="right" delay={0.4}>
              <PrayerTimes />
            </ScrollAnimation>
            <ScrollAnimation direction="left" delay={0.4}>
              <Announcements />
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  )
}
