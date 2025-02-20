import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection'
import { PrayerTimes } from '@/components/home/PrayerTimes'
import { Announcements } from '@/components/home/Announcements'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      {/* Gallery Button Section */}
      <section className="py-12 bg-[#FFFAF0]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Link 
              href="/gallery" 
              className="inline-block px-8 py-4 text-xl font-bold text-white bg-[#8B4513] hover:bg-[#B8860B] rounded-lg shadow-lg transition-colors duration-300"
            >
              לצפייה בגלריית התמונות
            </Link>
          </div>
        </div>
      </section>

      {/* Prayer Times and Announcements Section */}
      <section className="py-12 bg-[#FFFAF0]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PrayerTimes />
            <Announcements />
          </div>
        </div>
      </section>
    </div>
  )
}
