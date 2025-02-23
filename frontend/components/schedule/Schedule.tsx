'use client';

import React, { useState, useEffect } from 'react';

interface PrayerTime {
  id: number;
  name: string;
  time: string;
  description?: string;
}

export function Schedule() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8B4513]">טוען זמני תפילה...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-6 rounded-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
            >
              נסה שוב
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (prayerTimes.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-[#8B4513] text-lg">אין זמני תפילה זמינים כרגע</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#8B4513] mb-8 text-center">זמני תפילות</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {prayerTimes.map((prayer) => (
          <div
            key={prayer.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-bold text-[#8B4513] mb-2">{prayer.name}</h3>
            <p className="text-2xl text-[#B8860B] mb-2 font-bold">{prayer.time}</p>
            {prayer.description && (
              <p className="text-gray-600 text-sm">{prayer.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
