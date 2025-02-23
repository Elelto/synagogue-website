'use client';

import { Gallery } from '@/components/gallery/Gallery';
import { ScrollAnimation } from '@/components/shared/ScrollAnimation';

export default function Page() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto">
        <ScrollAnimation direction="down" delay={0.2}>
          <h1 className="text-4xl font-bold text-center text-[#8B4513] mb-16">גלריית תמונות</h1>
        </ScrollAnimation>
        <ScrollAnimation direction="up" delay={0.4}>
          <Gallery />
        </ScrollAnimation>
      </div>
    </div>
  );
}
