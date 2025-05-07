'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { HebrewCalendar as HebCal, HDate, months } from '@hebcal/core';

interface MemorialDay {
  id: number;
  hebrewDate: string;
  gregorianDate: Date;
  purchasedBy: string;
  dedicatedTo: string;
  message?: string;
}

interface DayProps {
  date: Date;
  hebrewDate: string;
  isPurchased: boolean;
  onClick: () => void;
}

const CandleIcon: React.FC<{ isLit: boolean }> = ({ isLit }) => {
  return (
    <motion.div
      className="relative w-6 h-8"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.2 }}
    >
      {/* Flame */}
      {isLit && (
        <motion.div
          className="absolute w-4 h-6 bottom-[1.75rem] left-1/2 transform -translate-x-1/2"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [-2, 2, -2]
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut"
          }}
        >
          {/* Inner flame */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-amber-400 rounded-full blur-[1px]" />
          {/* Outer flame */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-amber-500 rounded-full opacity-50 blur-[2px]" />
          {/* Glow effect */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-300 rounded-full opacity-20 blur-[4px]" />
        </motion.div>
      )}
      
      {/* Candle body */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-gray-100 to-white rounded-sm shadow-md">
        {/* Wick */}
        <div className="absolute -top-[2px] left-1/2 transform -translate-x-1/2 w-[2px] h-[3px] bg-gray-600 rounded-full" />
        
        {/* Wax drips */}
        <div className="absolute -right-[1px] top-1 w-[3px] h-[8px] bg-white rounded-full transform rotate-3" />
        <div className="absolute -left-[1px] top-2 w-[2px] h-[6px] bg-white rounded-full transform -rotate-3" />
      </div>
      
      {/* Base */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-[3px] bg-gray-300 rounded-full" />
      
      {/* Reflection */}
      {isLit && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-amber-100 rounded-full opacity-30 blur-[2px]" />
      )}
    </motion.div>
  );
};

const DayCell: React.FC<DayProps> = ({ date, hebrewDate, isPurchased, onClick }) => {
  return (
    <motion.button
      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-amber-50 relative min-h-[80px] border border-amber-100 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span className="text-sm font-medium text-amber-900">{format(date, 'd')}</span>
      <span className="text-xs text-amber-800 mt-1 font-serif">{hebrewDate}</span>
      <div className="mt-2">
        <CandleIcon isLit={isPurchased} />
      </div>
    </motion.button>
  );
};

interface PurchaseFormData {
  dedicatedTo: string;
  purchasedBy: string;
  email: string;
  phone: string;
  message?: string;
}

const DayDetails: React.FC<{
  day: { date: Date; hebrewDate: string; isPurchased: boolean };
  onClose: () => void;
  onPurchase: () => Promise<void>;
}> = ({ day, onClose, onPurchase }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PurchaseFormData>({
    dedicatedTo: '',
    purchasedBy: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Open Kesher payment page in a new window
      const kesherUrl = `https://kesher.org.il/pay/YOUR_ORG_ID`; // יש להחליף ל-ID של הארגון שלך
      const params = new URLSearchParams({
        sum: '18', // מחיר קבוע לנר נשמה
        full_name: formData.purchasedBy,
        email: formData.email,
        phone: formData.phone,
        comments: `נר נשמה לעילוי נשמת ${formData.dedicatedTo}. ${formData.message || ''}`,
        success_url: `${window.location.origin}/memorial/thank-you`,
        cancel_url: `${window.location.origin}/memorial`,
        payment_type: '1', // תשלום רגיל
        max_payments: '1' // תשלום אחד
      });

      window.location.href = `${kesherUrl}?${params.toString()}`;
    } catch (error) {
      console.error('Error redirecting to Kesher:', error);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg p-6 max-w-md w-full rtl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-right">פרטי היום</h3>
        <p className="mb-2 text-right">תאריך עברי: {day.hebrewDate}</p>
        <p className="mb-4 text-right">תאריך לועזי: {format(day.date, 'dd/MM/yyyy')}</p>
        
        {day.isPurchased ? (
          <p className="text-red-600 text-right">יום זה כבר נרכש</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-right mb-1">לעילוי נשמת</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-lg text-right"
                value={formData.dedicatedTo}
                onChange={(e) => setFormData({ ...formData, dedicatedTo: e.target.value })}
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-right mb-1">שם התורם</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-lg text-right"
                value={formData.purchasedBy}
                onChange={(e) => setFormData({ ...formData, purchasedBy: e.target.value })}
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-right mb-1">דוא״ל</label>
              <input
                type="email"
                required
                className="w-full p-2 border rounded-lg text-right"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-right mb-1">טלפון</label>
              <input
                type="tel"
                required
                pattern="[0-9]{9,10}"
                className="w-full p-2 border rounded-lg text-right"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                dir="rtl"
                placeholder="0501234567"
              />
            </div>

            <div>
              <label className="block text-right mb-1">הערה (אופציונלי)</label>
              <textarea
                className="w-full p-2 border rounded-lg text-right"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                dir="rtl"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] text-white py-3 px-4 rounded-lg transition-colors border-2 border-[#1E6B87] disabled:opacity-50 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
              {isLoading ? 'מעבד...' : 'המשך לתשלום - ₪18'}
            </button>
          </form>
        )}
        
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          סגור
        </button>
      </motion.div>
    </motion.div>
  );
};

const getHebrewDate = (date: Date) => {
  const hDate = new HDate(date);
  const monthName = Object.keys(months)[hDate.getMonth() - 1];
  return `${hDate.getDate()} ${monthName} ${hDate.getFullYear()}`;
};

const LargeCandle: React.FC<{ isLit: boolean }> = ({ isLit }) => {
  return (
    <div className="relative w-24 h-32 mx-auto">
      {/* Flame */}
      {isLit && (
        <motion.div
          className="absolute w-16 h-24 bottom-28 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [-2, 2, -2]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-amber-400 rounded-full blur-[2px]" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-amber-500 rounded-full opacity-50 blur-[4px]" />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-amber-300 rounded-full opacity-20 blur-[8px]" />
        </motion.div>
      )}
      
      {/* Candle body */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-gradient-to-b from-gray-100 to-white rounded-lg shadow-lg">
        {/* Wick */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-600 rounded-full" />
        
        {/* Wax drips */}
        <div className="absolute -right-1 top-4 w-2 h-8 bg-white rounded-full transform rotate-3" />
        <div className="absolute -left-1 top-6 w-2 h-6 bg-white rounded-full transform -rotate-3" />
      </div>
      
      {/* Base */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gray-300 rounded-full" />
      
      {/* Reflection */}
      {isLit && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-amber-100 rounded-full opacity-30 blur-[4px]" />
      )}
    </div>
  );
};

export const MemorialCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [purchasedDays, setPurchasedDays] = useState<MemorialDay[]>([]);
  
  const daysInMonth = Array.from(
    { length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() },
    (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
  );

  const handlePurchase = async () => {
    // This will be handled by the form submission in DayDetails
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
          className="p-2 hover:bg-amber-50 rounded-full transition-colors"
        >
          <span className="text-2xl">→</span>
        </button>
        
        <h2 className="text-2xl font-bold text-amber-900">
          {format(currentMonth, 'MMMM yyyy', { locale: he })}
        </h2>
        
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
          className="p-2 hover:bg-amber-50 rounded-full transition-colors"
        >
          <span className="text-2xl">←</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day) => (
          <div key={day} className="text-center font-bold text-amber-900">
            {day}
          </div>
        ))}
        
        {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {daysInMonth.map((date) => {
          const hebrewDate = getHebrewDate(date);
          const isPurchased = purchasedDays.some(
            (day) => day.gregorianDate.getTime() === date.getTime()
          );
          
          return (
            <DayCell
              key={date.getTime()}
              date={date}
              hebrewDate={hebrewDate}
              isPurchased={isPurchased}
              onClick={() => setSelectedDate(date)}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <DayDetails
            day={{
              date: selectedDate,
              hebrewDate: getHebrewDate(selectedDate),
              isPurchased: purchasedDays.some(
                (day) => day.gregorianDate.getTime() === selectedDate.getTime()
              )
            }}
            onClose={() => setSelectedDate(null)}
            onPurchase={handlePurchase}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
