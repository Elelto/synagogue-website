'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { HebrewCalendar as HebCal, HDate, months } from '@hebcal/core';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { loadStripe } from '@stripe/stripe-js';

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

const DayDetails: React.FC<{
  day: { date: Date; hebrewDate: string; isPurchased: boolean };
  onClose: () => void;
  onPurchase: () => Promise<void>;
}> = ({ day, onClose, onPurchase }) => {
  const [isLoading, setIsLoading] = useState(false);

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
          <div className="space-y-4">
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => onPurchase()}
              disabled={isLoading}
            >
              {isLoading ? 'מעבד...' : 'הדלק נר נשמה'}
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [{
                      amount: {
                        value: '18.00',
                        currency_code: 'USD'
                      } as const
                    }] as const
                  } as const);
                }}
                onApprove={async (data, actions) => {
                  await onPurchase();
                }}
              />
            </div>
          </div>
        )}
        
        <button
          className="mt-4 text-gray-600 hover:text-gray-800 w-full text-center"
          onClick={onClose}
        >
          סגירה
        </button>
      </motion.div>
    </motion.div>
  );
};

const getHebrewDate = (date: Date) => {
  const hebrewDate = new HDate(date);
  return hebrewDate.toString();
};

const LargeCandle: React.FC = () => {
  return (
    <div className="relative w-20 h-36 flex flex-col items-center">
      {/* Animated flame */}
      <motion.div
        className="w-4 h-6 mb-1"
        animate={{
          height: ["24px", "28px", "24px"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-orange-400 rounded-full blur-[1px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-orange-300 rounded-full opacity-50 blur-[2px] scale-125" />
      </motion.div>
      
      {/* Static candle */}
      <div className="w-4 h-28 bg-white" />
    </div>
  );
};

export const MemorialCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    hebrewDate: string;
    isPurchased: boolean;
  } | null>(null);
  const [purchasedDays, setPurchasedDays] = useState<MemorialDay[]>([]);

  useEffect(() => {
    fetch('/api/memorial-days')
      .then(res => res.json())
      .then(data => setPurchasedDays(data))
      .catch(console.error);
  }, []);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let date = firstDay; date <= lastDay; date = new Date(date.setDate(date.getDate() + 1))) {
      const hDate = new HDate(date);
      days.push({
        date: new Date(date),
        hebrewDate: getHebrewDate(date),
        isPurchased: purchasedDays.some(pd => 
          format(new Date(pd.gregorianDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        )
      });
    }

    return days;
  };

  const handlePurchase = async () => {
    if (!selectedDay) return;

    try {
      const response = await fetch('/api/memorial-days', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hebrewDate: selectedDay.hebrewDate,
          gregorianDate: selectedDay.date,
        }),
      });

      if (response.ok) {
        const newPurchasedDay = await response.json();
        setPurchasedDays([...purchasedDays, newPurchasedDay]);
        setSelectedDay(null);
      }
    } catch (error) {
      console.error('שגיאה ברכישת היום:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 rtl">
      <div className="relative flex justify-center">
        {/* Main calendar in center */}
        <div className="w-full max-w-[800px]">
          <div className="bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl shadow-lg p-8 border border-amber-200">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="text-amber-800 hover:text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-full p-2 transition-colors duration-200"
              >
                &gt;
              </button>
              <h2 className="text-3xl font-bold text-amber-950">
                {format(currentDate, 'MMMM yyyy', { locale: he })}
              </h2>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="text-amber-800 hover:text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-full p-2 transition-colors duration-200"
              >
                &lt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
                <div key={day} className="text-center font-bold text-amber-900 pb-2 border-b border-amber-200">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((day, index) => (
                <DayCell
                  key={index}
                  {...day}
                  onClick={() => setSelectedDay(day)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Candle */}
        <div className="lg:absolute lg:right-[-280px] lg:top-0 w-full lg:w-[250px] mt-8 lg:mt-0">
          <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl border border-amber-200">
            <div className="transform lg:scale-100 scale-75">
              <LargeCandle />
            </div>
            <div className="text-center">
              <p className="text-xl lg:text-2xl text-amber-950 font-serif mt-4 lg:mt-8">נר ה׳ נשמת אדם</p>
              <p className="text-xs lg:text-sm text-amber-800 mt-2">משלי כ׳ פסוק כ״ז</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && (
          <DayDetails
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
            onPurchase={handlePurchase}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
