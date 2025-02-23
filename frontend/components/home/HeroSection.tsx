'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../app/globals.css';

export function HeroSection() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50"
          style={{
            backgroundSize: 'cover',
            opacity: 0.9
          }}
        />
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

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/gallery" 
            className="golden-button hebrew-text text-lg"
          >
            גלריית תמונות
          </Link>
          <Link 
            href="/schedule" 
            className="golden-button hebrew-text text-lg"
          >
            זמני תפילות
          </Link>
          <Link 
            href="/contact" 
            className="golden-button hebrew-text text-lg"
          >
            צור קשר
          </Link>
        </div>
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-30" />
    </section>
  );
}
