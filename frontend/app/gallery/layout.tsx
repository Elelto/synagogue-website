import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'גלריית תמונות - בית הכנסת חזון יוסף',
  description: 'גלריית תמונות מאירועים ופעילויות בבית הכנסת חזון יוסף',
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}
