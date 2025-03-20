'use client';

import Link from 'next/link';
import { ScrollAnimation } from '../../../components/shared/ScrollAnimation';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#87CEEB] py-12">
      <div className="container mx-auto px-4">
        <ScrollAnimation direction="down" delay={0.2}>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
            <h1 className="text-4xl font-bold mb-6 hebrew-text">תודה רבה על תרומתך!</h1>
            <p className="text-xl mb-8 hebrew-text">
              תרומתך תסייע לנו להמשיך בפעילות בית הכנסת ולחזק את הקהילה.
              יישר כח!
            </p>
            <Link
              href="/"
              className="inline-block px-10 py-5 text-2xl font-bold text-white bg-[#C6A45C] hover:bg-[#D4AF37] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87]"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
