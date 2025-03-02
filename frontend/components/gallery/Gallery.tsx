'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
}

const images: GalleryImage[] = [
  {
    id: 1,
    src: '/images/gallery/IMG-20250219-WA0006.jpg',
    alt: 'תפילת שחרית',
    category: 'תפילות',
    width: 800,
    height: 600
  },
  {
    id: 2,
    src: '/images/gallery/IMG-20250219-WA0007.jpg',
    alt: 'שיעור תורה',
    category: 'שיעורים',
    width: 800,
    height: 600
  },
  {
    id: 3,
    src: '/images/gallery/IMG-20250219-WA0008.jpg',
    alt: 'סעודה שלישית',
    category: 'אירועים',
    width: 800,
    height: 600
  },
  {
    id: 4,
    src: '/images/gallery/IMG-20250219-WA0009.jpg',
    alt: 'אירוע קהילתי',
    category: 'אירועים',
    width: 800,
    height: 600
  },
  {
    id: 5,
    src: '/images/gallery/IMG-20250219-WA0010.jpg',
    alt: 'לימוד תורה',
    category: 'שיעורים',
    width: 800,
    height: 600
  }
];

const categories = images
  .map(img => img.category)
  .filter((category, index, array) => array.indexOf(category) === index);

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredImages = selectedCategory
    ? images.filter(img => img.category === selectedCategory)
    : images;

  const currentImageIndex = selectedImage
    ? filteredImages.findIndex(img => img.id === selectedImage.id)
    : -1;

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setSelectedImage(filteredImages[currentImageIndex - 1]);
    }
  }, [currentImageIndex, filteredImages]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentImageIndex + 1]);
    }
  }, [currentImageIndex, filteredImages]);

  const handleZoomIn = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.25, 2));
  }, []);

  const handleZoomOut = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImage) {
      switch (e.key) {
        case 'ArrowLeft':
          if (currentImageIndex < filteredImages.length - 1) {
            setSelectedImage(filteredImages[currentImageIndex + 1]);
          }
          break;
        case 'ArrowRight':
          if (currentImageIndex > 0) {
            setSelectedImage(filteredImages[currentImageIndex - 1]);
          }
          break;
        case 'Escape':
          setSelectedImage(null);
          break;
      }
    }
  }, [currentImageIndex, filteredImages, selectedImage]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#8B4513] mb-8 text-center">גלריית תמונות</h2>
      
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-full transition-colors duration-300 ${
            !selectedCategory
              ? 'bg-[#8B4513] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          הכל
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              selectedCategory === category
                ? 'bg-[#8B4513] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
            onClick={() => {
              setSelectedImage(image);
              setZoomLevel(1);
            }}
          >
            <div className="relative w-full h-64">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                priority={image.id <= 3}
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center">
                <span className="text-white text-lg font-semibold block">{image.alt}</span>
                <span className="text-white text-sm mt-2 block">{image.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedImage(null);
            setZoomLevel(1);
          }}
        >
          <div className="relative max-w-6xl w-full h-auto">
            {/* Navigation Buttons */}
            {currentImageIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-10"
                onClick={handlePrevImage}
              >
                ❮
              </button>
            )}
            {currentImageIndex < filteredImages.length - 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-10"
                onClick={handleNextImage}
              >
                ❯
              </button>
            )}

            {/* Image */}
            <div className="overflow-hidden">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={selectedImage.width}
                height={selectedImage.height}
                className="object-contain w-full h-auto transition-transform duration-300"
                style={{ transform: `scale(${zoomLevel})` }}
                priority
              />
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-50 px-4 py-2 rounded-full">
              <button
                className="text-white hover:text-gray-300"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
              >
                −
              </button>
              <span className="text-white">{Math.round(zoomLevel * 100)}%</span>
              <button
                className="text-white hover:text-gray-300"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2}
              >
                +
              </button>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
                setZoomLevel(1);
              }}
            >
              ✕
            </button>

            {/* Image Info */}
            <div className="absolute bottom-4 right-4 text-white text-right bg-black bg-opacity-50 p-2 rounded">
              <div className="font-semibold">{selectedImage.alt}</div>
              <div className="text-sm">{selectedImage.category}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
