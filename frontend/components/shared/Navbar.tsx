'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    try {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 0);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } catch (err) {
      console.error('Error setting up scroll listener:', err);
      setError('אירעה שגיאה בטעינת התפריט');
    }
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 p-4 text-red-600 text-center">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          רענן דף
        </button>
      </div>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="relative w-14 h-14">
            <div className={`transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Link href="/">
                <Image
                  src="/images/logo-removebg-preview.png"
                  alt="לוגו בית הכנסת"
                  width={56}
                  height={56}
                  onLoad={() => setLogoLoaded(true)}
                  onError={(e) => {
                    console.error('Failed to load logo');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
            {!logoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-10 justify-center items-center">
            <Link 
              href="/" 
              className="text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300 font-bold text-2xl"
            >
              דף הבית
            </Link>
            <Link 
              href="/gallery" 
              className="text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300 font-bold text-2xl"
            >
              גלריית תמונות
            </Link>
            <Link 
              href="/schedule" 
              className="text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300 font-bold text-2xl"
            >
              זמני תפילות
            </Link>
            <Link 
              href="/contact" 
              className="text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300 font-bold text-2xl"
            >
              צור קשר
            </Link>
            <Link 
              href="/donate" 
              className="relative px-6 py-2 bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] text-white rounded-full transition-all duration-300 font-bold text-2xl border-2 border-[#1E6B87] shadow-md overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
              תרומה
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-screen py-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-10 bg-white/90 backdrop-blur-sm rounded-lg p-4">
            <Link 
              href="/" 
              className="text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300 font-bold text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              דף הבית
            </Link>
            <Link 
              href="/gallery" 
              className="text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300 font-bold text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              גלריית תמונות
            </Link>
            <Link 
              href="/schedule" 
              className="text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300 font-bold text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              זמני תפילות
            </Link>
            <Link 
              href="/contact" 
              className="text-[#1E6B87] hover:text-[#87CEEB] transition-colors duration-300 font-bold text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              צור קשר
            </Link>
            <Link 
              href="/donate" 
              className="relative px-6 py-2 bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] text-white rounded-full transition-all duration-300 font-bold text-2xl border-2 border-[#1E6B87] shadow-md overflow-hidden group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
              תרומה
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
