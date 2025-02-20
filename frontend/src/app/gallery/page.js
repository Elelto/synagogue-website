'use client';

import { Gallery } from '@/components/gallery/Gallery';

export default function Page() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#8B4513] mb-16">גלריית תמונות</h1>
        <Gallery />
      </div>
    </div>
  );
}
