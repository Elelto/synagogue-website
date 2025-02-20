import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../../app/globals.css';

export const HeroSection = () => {
  return (
    <div className="relative h-[80vh]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[#FFFAF0] opacity-90">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B8860B' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center h-full">
        {/* Logo Container */}
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 bg-white/50 rounded-full blur-xl transform -translate-y-4"></div>
          <div className="relative w-64 h-64">
            <Image
              src="/images/logo-removebg-preview.png"
              alt="בית הכנסת חזון יוסף"
              fill
              style={{ objectFit: 'contain' }}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-[#8B4513] mb-6 text-center hebrew-text drop-shadow-lg">
          חזון יוסף
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl text-[#B8860B] mb-6 text-center max-w-2xl hebrew-text">
          לעילוי נשמת מרן דשבה"ג רבנו עובדיה יוסף זצוקללה"ה
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-[#1C1C1C] mb-8 text-center max-w-2xl hebrew-text leading-relaxed">
          מקום של תפילה, לימוד וקהילה
        </p>

        {/* Call to Action */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/gallery" className="golden-button hebrew-text text-lg">
            גלריית תמונות
          </Link>
          <Link href="/schedule" className="golden-button hebrew-text text-lg">
            זמני תפילות
          </Link>
          <Link href="/contact" className="golden-button hebrew-text text-lg">
            צור קשר
          </Link>
        </div>
      </div>
    </div>
  );
};
