'use client';

import React, { useState, useEffect } from 'react';

interface PrayerTime {
  id: number;
  name: string;
  time: string;
  description?: string;
}

interface SpecialEvent {
  title: string;
  description: string;
  date: string;
  time: string;
}

export function Schedule() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);

  const fetchPrayerTimes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/prayer-times');
      
      if (!response.ok) {
        throw new Error('שגיאה בטעינת זמני התפילה');
      }

      const data = await response.json();
      setPrayerTimes(data);
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      setError('אירעה שגיאה בטעינת זמני התפילה. אנא נסה שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchPrayerTimes();
  };

  const handlePrevDay = () => {
    setSelectedDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 1)));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#1E6B87] mb-8 text-center">לוח זמנים</h2>

      {/* Date Selector */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handlePrevDay}
          className="px-4 py-2 text-[#1E6B87] hover:text-[#C6A45C] transition-colors duration-300"
        >
          ❮ יום הקודם
        </button>
        <div className="text-[#1E6B87] font-semibold text-lg">
          {selectedDate.toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <button
          onClick={handleNextDay}
          className="px-4 py-2 text-[#1E6B87] hover:text-[#C6A45C] transition-colors duration-300"
        >
          יום הבא ❯
        </button>
      </div>

      {isLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#C6A45C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#1E6B87] font-semibold">טוען זמני תפילה...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-[#E6EEF2] p-6 rounded-lg text-center">
          <p className="text-[#1E6B87] mb-4">{error}</p>
          <button
            onClick={fetchPrayerTimes}
            className="px-6 py-3 bg-[#C6A45C] text-white rounded-full hover:bg-[#D4AF37] transition-colors duration-300"
          >
            נסה שוב
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className="bg-white p-6 rounded-lg shadow-md border border-[#E6EEF2] hover:border-[#1E6B87] transition-colors duration-300"
            >
              <h3 className="text-xl font-bold text-[#1E6B87] mb-3">{prayer.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[#1E6B87]">
                  <span>זמן התפילה</span>
                  <span className="font-semibold">{prayer.time}</span>
                </div>
                {prayer.description && (
                  <p className="text-[#1E6B87]">{prayer.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Special Events Section */}
      {specialEvents.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-[#1E6B87] mb-6 text-center">אירועים מיוחדים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialEvents.map((event, index) => (
              <div
                key={index}
                className="bg-[#E6EEF2] p-6 rounded-lg"
              >
                <h4 className="text-xl font-bold text-[#1E6B87] mb-2">{event.title}</h4>
                <p className="text-[#1E6B87] mb-4">{event.description}</p>
                <div className="flex items-center justify-between text-[#1E6B87]">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
