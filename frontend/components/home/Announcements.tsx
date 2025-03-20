'use client';

import React, { useState, useEffect } from 'react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Announcement[];
  message?: string;
  error?: string;
}

interface ErrorState {
  type: 'network' | 'api' | 'unknown';
  message: string;
  details?: string;
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnnouncements = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
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

      const response = await fetch(`${apiUrl}/api/announcements`, {
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
          message: result.error || 'שגיאה בטעינת ההודעות',
          details: result.message || 'API returned success: false'
        };
      }

      setAnnouncements(result.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      
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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    // מעדכן כל 5 דקות
    const interval = setInterval(() => fetchAnnouncements(true), 300000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchAnnouncements();
    }
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">הודעות</h2>
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C6A45C]"></div>
          <div className="text-gray-600 mr-2">טוען הודעות...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">הודעות</h2>
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

  if (announcements.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">הודעות</h2>
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-gray-600">
            אין הודעות חדשות כרגע
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-[#1E6B87]">הודעות</h2>
        <button
          onClick={() => fetchAnnouncements(true)}
          disabled={isRefreshing}
          className="text-[#1E6B87] hover:text-[#C6A45C] transition-colors duration-300"
          title="רענן הודעות"
        >
          <svg className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div className="space-y-6">
        {announcements.map((announcement) => (
          <div 
            key={announcement.id}
            className="border-r-4 border-[#C6A45C] pr-4 py-2 hover:bg-[#1E6B87]/5 rounded-lg transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-[#1E6B87] mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#C6A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {announcement.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
