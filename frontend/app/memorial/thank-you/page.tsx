'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ThankYouPage() {
  useEffect(() => {
    // כאן אפשר להוסיף קוד שמעדכן את מסד הנתונים שהנר נרכש
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-amber-100 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center"
        >
          <h1 className="text-3xl font-bold text-amber-950 mb-6">תודה על תרומתך</h1>
          <p className="text-lg text-amber-900 mb-8 leading-relaxed">
            נר הנשמה שלך יאיר לעילוי נשמת יקירך.
            <br />
            תודה על תמיכתך בקהילה שלנו.
          </p>
          
          <div className="w-32 h-32 mx-auto mb-8">
            <div className="relative w-full h-full">
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-full h-full bg-amber-400 rounded-full blur-[8px]" />
              </motion.div>
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="w-full h-full bg-amber-500 rounded-full blur-[12px]" />
              </motion.div>
            </div>
          </div>

          <Link
            href="/memorial"
            className="inline-block bg-[#C6A45C] hover:bg-[#D4AF37] text-white py-3 px-8 rounded-lg transition-colors border-2 border-[#1E6B87]"
          >
            חזרה ללוח המצבות
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
