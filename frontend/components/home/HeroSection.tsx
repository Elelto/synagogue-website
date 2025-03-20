'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../app/globals.css';

export function HeroSection() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-background.jpeg"
          alt="בית המדרש"
          fill
          style={{ objectFit: 'cover' }}
          className={`grayscale transition-transform duration-1000 ${scrolled ? 'scale-110' : 'scale-100'}`}
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#87CEEB] opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center h-full">
        {/* Logo Container with Animation */}
        <div className={`relative w-96 h-96 md:w-[32rem] md:h-[32rem] mb-16 transition-all duration-700 ${isImageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Image
            src="/images/logo-removebg-preview.png"
            alt="בית הכנסת חזון יוסף"
            fill
            style={{ objectFit: 'contain' }}
            className="drop-shadow-2xl"
            priority
            quality={90}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        {/* Welcome Text */}
        <div className={`text-center mb-12 transition-all duration-700 delay-300 ${isImageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E6B87] mb-4 hebrew-text">ברוכים הבאים לבית הכנסת חזון יוסף</h1>
          <p className="text-xl md:text-2xl text-gray-700 hebrew-text">מקום של תורה, תפילה וחסד</p>
        </div>

        {/* Action Buttons with Hover Effects */}
        <div className={`flex flex-wrap justify-center gap-6 md:gap-8 transition-all duration-700 delay-500 ${isImageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            href="/schedule" 
            className="group px-10 py-5 text-2xl md:text-3xl font-bold text-white bg-[#C6A45C] hover:bg-[#D4AF37] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] hover:scale-105"
          >
            <span className="inline-flex items-center">
              זמני תפילות
              <svg className="w-6 h-6 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </Link>
          <Link 
            href="/gallery" 
            className="group px-10 py-5 text-2xl md:text-3xl font-bold text-white bg-[#C6A45C] hover:bg-[#D4AF37] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] hover:scale-105"
          >
            <span className="inline-flex items-center">
              גלריה
              <svg className="w-6 h-6 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </Link>
          <Link 
            href="/contact" 
            className="group px-10 py-5 text-2xl md:text-3xl font-bold text-white bg-[#C6A45C] hover:bg-[#D4AF37] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] hover:scale-105"
          >
            <span className="inline-flex items-center">
              יצירת קשר
              <svg className="w-6 h-6 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 delay-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-[#1E6B87]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
