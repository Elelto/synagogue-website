'use client';

import React, { useState, useEffect } from 'react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        // כאן יהיה הקוד לקבלת ההודעות מה-API
        const response = await fetch('/api/announcements');
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const data = await response.json();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('לא ניתן לטעון את ההודעות כרגע. אנא נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">הודעות</h2>
        <div className="flex justify-center">
          <div className="text-gray-600">טוען הודעות...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">הודעות</h2>
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

  // אם אין הודעות
  if (announcements.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">הודעות</h2>
        <div className="text-center text-gray-600">
          אין הודעות חדשות כרגע
        </div>
      </div>
    );
  }

  return (
    <div className="content-box">
      <h2 className="section-title">הודעות ואירועים</h2>
      <div className="space-y-6">
        {announcements.map((announcement) => (
          <div 
            key={announcement.id}
            className="border-r-4 border-[#B8860B] pr-4 py-2"
          >
            <h3 className="text-2xl font-bold text-[#8B4513] hebrew-text mb-2">
              {announcement.title}
            </h3>
            <div className="flex items-center text-[#B8860B] mb-2">
              <span className="text-lg font-medium">{announcement.date}</span>
              <span className="mx-2">•</span>
              <span className="text-lg">{announcement.content}</span>
            </div>
            <p className="text-[#1C1C1C] text-lg">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>
      <button className="golden-button w-full mt-8">
        לכל האירועים
      </button>
    </div>
  );
}
