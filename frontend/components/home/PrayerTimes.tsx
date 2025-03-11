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
          <p>{error.message}</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-sm mt-2 text-gray-500">
              פרטי שגיאה: {error.details}
            </p>
          )}
          {retryCount < 3 && (
            <button 
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">זמני תפילות</h2>
        <div className="text-center text-gray-600">
          אין זמני תפילות זמינים כרגע
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-[#8B4513]">זמני תפילות</h2>
      <div className="space-y-6">
        {Object.entries(groupedPrayerTimes).map(([day, prayers]) => (
          <div key={day} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">יום {day}</h3>
            <div className="space-y-2">
              {prayers.map((prayer) => (
                <div 
                  key={prayer.id}
                  className="flex justify-between items-center text-gray-700"
                >
                  <span className="font-medium">{prayer.name}</span>
                  <span>{prayer.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
