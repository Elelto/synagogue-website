'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'ראשי' },
  { href: '/gallery', label: 'גלריה' },
  { href: '/prayer-times', label: 'זמני תפילה' },
  { href: '/events', label: 'אירועים' },
  { href: '/contact', label: 'צור קשר' },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* לוגו */}
          <Link href="/" className="flex items-center">
            <div className="relative w-12 h-12">
              <Image
                src="/images/logo-removebg-preview.png"
                alt="בית הכנסת חזון יוסף"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[#8B4513] font-bold text-xl mr-2">חזון יוסף</span>
          </Link>

          {/* תפריט */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg transition-colors duration-300 ${
                  pathname === item.href
                    ? 'text-[#8B4513] font-bold'
                    : 'text-[#1C1C1C] hover:text-[#B8860B]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* כפתור תפריט נייד */}
          <button className="md:hidden text-[#8B4513] hover:text-[#B8860B] transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
