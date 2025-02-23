'use client';

import React, { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  time: string;
}

export function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prayer-times`);
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times');
        }
        const data = await response.json();
        setPrayerTimes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('לא ניתן לטעון את זמני התפילה כרגע. אנא נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">זמני תפילות</h2>
        <div className="flex justify-center">
          <div className="text-gray-600">טוען זמני תפילות...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">זמני תפילות</h2>
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  // אם אין זמני תפילה
  if (prayerTimes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">זמני תפילות</h2>
        <div className="text-center text-gray-600">
          אין זמני תפילות זמינים כרגע
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">זמני תפילות</h2>
      <div className="space-y-4">
        {prayerTimes.map((prayer, index) => (
          <div 
            key={index}
            className="flex justify-between items-center border-b border-gray-200 pb-2"
          >
            <span className="font-semibold text-[#8B4513]">{prayer.name}</span>
            <span className="text-gray-600">{prayer.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
