'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  url: string;
  categoryId: number;
  displayOrder: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  images: GalleryImage[];
}

export function Gallery() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch categories and images
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/images/categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setError('שגיאה בטעינת התמונות. אנא נסה שוב מאוחר יותר.');
        setCategories([]);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  const filteredImages = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.images || []
    : categories.flatMap(c => c.images);

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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (error) {
    return (
      <div className="text-center text-red-600 p-4 rounded-md bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#1E6B87]">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#1E6B87] mb-8 text-center">גלריית תמונות</h2>
      
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-md border-2 transition-colors duration-300 ${
            !selectedCategory
              ? 'bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] text-white border-[#1E6B87]'
              : 'bg-white text-[#1E6B87] border-[#1E6B87] hover:bg-[#E6EEF2]'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          הכל
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-md border-2 transition-colors duration-300 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] text-white border-[#1E6B87]'
                : 'bg-white text-[#1E6B87] border-[#1E6B87] hover:bg-[#E6EEF2]'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-md shadow-lg transform transition duration-300 hover:scale-105 border-2 border-[#1E6B87]"
            onClick={() => {
              setSelectedImage(image);
              setZoomLevel(1);
            }}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={image.url}
                alt={image.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={image.displayOrder <= 2}
              />
            </div>
            <div className="absolute inset-0 bg-[#1E6B87] bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center">
                <span className="text-white text-lg font-semibold block">{image.title}</span>
                <span className="text-[#C6A45C] text-sm mt-2 block">{image.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-[#1E6B87] bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedImage(null);
            setZoomLevel(1);
          }}
        >
          <div className="relative max-w-4xl w-full">
            {/* Navigation Buttons */}
            {currentImageIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C6A45C] text-4xl hover:text-white z-10"
                onClick={handlePrevImage}
              >
                ❮
              </button>
            )}
            {currentImageIndex < filteredImages.length - 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#C6A45C] text-4xl hover:text-white z-10"
                onClick={handleNextImage}
              >
                ❯
              </button>
            )}

            {/* Image Container */}
            <div
              className="relative bg-white rounded-md shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  fill
                  style={{
                    objectFit: 'contain',
                    transform: `scale(${zoomLevel})`,
                    transition: 'transform 0.3s ease-in-out'
                  }}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#1E6B87] bg-opacity-75 text-white p-4">
                <h3 className="text-xl font-semibold mb-1">{selectedImage.title}</h3>
                <p className="text-[#C6A45C]">{selectedImage.description}</p>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  className="bg-[#1E6B87] text-white rounded-md p-2 hover:bg-[#1E6B87]/80"
                  onClick={handleZoomIn}
                >
                  +
                </button>
                <button
                  className="bg-[#1E6B87] text-white rounded-md p-2 hover:bg-[#1E6B87]/80"
                  onClick={handleZoomOut}
                >
                  -
                </button>
              </div>

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-[#C6A45C] hover:text-white"
                onClick={() => {
                  setSelectedImage(null);
                  setZoomLevel(1);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
