'use client';

import React, { useState, useEffect } from 'react';

interface PrayerTime {
  id: number;
  name: string;
  time: string;
  dayOfWeek: number | null;
  isHoliday: boolean;
}

interface ApiResponse {
  success: boolean;
  data: PrayerTime[];
  message?: string;
  error?: string;
}

interface ErrorState {
  type: 'network' | 'api' | 'unknown';
  message: string;
  details?: string;
}

export function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentDay, setCurrentDay] = useState<string>('');

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw {
          type: 'network' as const,
          message: 'תצורת השרת אינה תקינה',
          details: 'NEXT_PUBLIC_API_URL is not defined'
        };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${apiUrl}/api/prayer-times`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw {
            type: 'api' as const,
            message: 'הנתיב המבוקש לא נמצא',
            details: 'API endpoint not found'
          };
        }
        throw {
          type: 'network' as const,
          message: 'שגיאה בתקשורת עם השרת',
          details: `HTTP error ${response.status}`
        };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw {
          type: 'api' as const,
          message: 'תגובה לא תקינה מהשרת',
          details: 'Invalid content type'
        };
      }

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw {
          type: 'api' as const,
          message: result.error || 'שגיאה בטעינת זמני התפילה',
          details: result.message || 'API returned success: false'
        };
      }

      setPrayerTimes(result.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError({
          type: 'network',
          message: 'השרת לא הגיב בזמן. אנא נסה שוב.',
          details: 'Request timed out after 5 seconds'
        });
      } else if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError({
          type: 'network',
          message: 'לא ניתן להתחבר לשרת. אנא בדוק את החיבור לאינטרנט.',
          details: err.message
        });
      } else if (err && typeof err === 'object' && 'type' in err) {
        setError(err as ErrorState);
      } else {
        setError({
          type: 'unknown',
          message: 'אירעה שגיאה בלתי צפויה',
          details: err instanceof Error ? err.message : String(err)
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes();
    
    // Set current day on mount and update it every minute
    const updateCurrentDay = () => {
      const now = new Date();
      const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
      setCurrentDay(days[now.getDay()]);
    };
    
    updateCurrentDay();
    const interval = setInterval(updateCurrentDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchPrayerTimes();
    }
  };

  const getDayName = (dayOfWeek: number | null): string => {
    if (dayOfWeek === null) return 'חג';
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return days[dayOfWeek];
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">זמני תפילות</h2>
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C6A45C]"></div>
          <div className="text-gray-600 mr-2">טוען זמני תפילות...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">זמני תפילות</h2>
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error.message}</p>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-sm mt-2 text-gray-500">
              פרטי שגיאה: {error.details}
            </p>
          )}
          {retryCount < 3 && (
            <button 
              onClick={handleRetry}
              className="mt-4 px-6 py-2 bg-[#C6A45C] text-white rounded-full hover:bg-[#D4AF37] transition-all duration-300 disabled:opacity-50 border-2 border-[#1E6B87]"
              disabled={loading}
            >
              {loading ? 'מנסה שוב...' : 'נסה שוב'}
            </button>
          )}
          {retryCount > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              ניסיון {retryCount} מתוך 3
            </p>
          )}
          {retryCount >= 3 && (
            <p className="text-sm mt-2 text-red-500">
              נכשלו כל הניסיונות. אנא נסה שוב מאוחר יותר.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (prayerTimes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">זמני תפילות</h2>
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">
            אין זמני תפילות זמינים כרגע
          </p>
        </div>
      </div>
    );
  }

  const groupedPrayerTimes = prayerTimes.reduce((acc, prayer) => {
    const day = prayer.isHoliday ? 'חג' : getDayName(prayer.dayOfWeek);
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(prayer);
    return acc;
  }, {} as Record<string, PrayerTime[]>);

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
      <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">זמני תפילות</h2>
      <div className="space-y-6">
        {Object.entries(groupedPrayerTimes).map(([day, prayers]) => (
          <div 
            key={day} 
            className={`border-b border-gray-200 last:border-b-0 pb-4 last:pb-0 transition-all duration-300 ${
              day === currentDay ? 'bg-[#1E6B87]/5 -mx-4 px-4 rounded-lg' : ''
            }`}
          >
            <h3 className={`text-lg font-semibold mb-2 flex items-center ${
              day === currentDay ? 'text-[#1E6B87]' : 'text-[#8B4513]'
            }`}>
              {day === currentDay && (
                <svg className="w-5 h-5 ml-1 text-[#C6A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              יום {day}
            </h3>
            <div className="space-y-2">
              {prayers.map((prayer) => (
                <div 
                  key={prayer.id}
                  className="flex justify-between items-center text-gray-700 hover:bg-[#1E6B87]/5 p-2 rounded-lg transition-colors duration-200"
                >
                  <span className="font-medium">{prayer.name}</span>
                  <span className="text-[#1E6B87] font-semibold">{prayer.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
