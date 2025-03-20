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
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="relative w-12 h-12">
            <div className={`transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Link href="/">
                <Image
                  src="/images/logo-removebg-preview.png"
                  alt="לוגו בית הכנסת"
                  width={48}
                  height={48}
                  onLoad={() => setLogoLoaded(true)}
                  onError={(e) => {
                    console.error('Failed to load logo');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
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
          <div className="hidden md:flex gap-8 justify-center items-center">
            <Link 
              href="/" 
              className="text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
            >
              דף הבית
            </Link>
            <Link 
              href="/gallery" 
              className="text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
            >
              גלריה
            </Link>
            <Link 
              href="/schedule" 
              className="text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
            >
              זמני תפילות
            </Link>
            <Link 
              href="/contact" 
              className="text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
            >
              צור קשר
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
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
            isMenuOpen ? 'max-h-64' : 'max-h-0'
          }`}
        >
          <div className="py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              דף הבית
            </Link>
            <Link 
              href="/gallery" 
              className="block text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              גלריה
            </Link>
            <Link 
              href="/schedule" 
              className="block text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              זמני תפילות
            </Link>
            <Link 
              href="/contact" 
              className="block text-[#8B4513] hover:text-[#B8860B] transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              צור קשר
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
