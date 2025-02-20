'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const images: GalleryImage[] = [
  {
    id: 1,
    src: '/images/gallery/IMG-20250219-WA0006.jpg',
    alt: 'תפילת שחרית',
    category: 'תפילות'
  },
  {
    id: 2,
    src: '/images/gallery/IMG-20250219-WA0007.jpg',
    alt: 'שיעור תורה',
    category: 'שיעורים'
  },
  {
    id: 3,
    src: '/images/gallery/IMG-20250219-WA0008.jpg',
    alt: 'סעודה שלישית',
    category: 'אירועים'
  }
];

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div 
          key={image.id} 
          className="relative aspect-square cursor-pointer"
          onClick={() => setSelectedImage(image)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg hover:opacity-90 transition-opacity"
            priority={image.id <= 4}
          />
        </div>
      ))}
    </div>
  );
}
