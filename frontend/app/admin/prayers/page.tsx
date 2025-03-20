'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

interface PrayerTime {
  id: number;
  name: string;
  time: string;
  dayOfWeek: number;
  isHoliday: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const DAYS_OF_WEEK = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת'
];

export default function PrayerTimesAdmin() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login');
    },
  });

  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [holidayPrayers, setHolidayPrayers] = useState<PrayerTime[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPrayer, setNewPrayer] = useState({
    name: '',
    time: '',
    dayOfWeek: 0,
    isHoliday: false
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return null;
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPrayerTimes();
      fetchHolidayPrayers();
    }
  }, [status]);

  const fetchPrayerTimes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/admin/prayer-times`, {
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.token || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('שגיאה בתקשורת עם השרת');
      }
      
      const data: ApiResponse<PrayerTime[]> = await response.json();
      
      if (data.success && data.data) {
        setPrayerTimes(data.data);
      } else {
        throw new Error(data.error || 'שגיאה בטעינת זמני התפילה');
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      toast.error(error instanceof Error ? error.message : 'שגיאה בטעינת זמני התפילה');
      setError(error instanceof Error ? error.message : 'שגיאה בטעינת זמני התפילה');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHolidayPrayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/admin/prayer-times?holiday=true`, {
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.token || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('שגיאה בתקשורת עם השרת');
      }
      
      const data: ApiResponse<PrayerTime[]> = await response.json();
      
      if (data.success && data.data) {
        setHolidayPrayers(data.data);
      } else {
        throw new Error(data.error || 'שגיאה בטעינת זמני תפילות החג');
      }
    } catch (error) {
      console.error('Error fetching holiday prayers:', error);
      toast.error(error instanceof Error ? error.message : 'שגיאה בטעינת זמני תפילות החג');
      setError(error instanceof Error ? error.message : 'שגיאה בטעינת זמני תפילות החג');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    
    try {
      const url = editingId 
        ? `${apiUrl}/api/admin/prayer-times/${editingId}`
        : `${apiUrl}/api/admin/prayer-times`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session?.user as any)?.token || ''}`
        },
        body: JSON.stringify(newPrayer),
      });

      if (!response.ok) {
        throw new Error('שגיאה בתקשורת עם השרת');
      }

      const data: ApiResponse<PrayerTime> = await response.json();

      if (data.success) {
        toast.success(editingId ? 'זמן התפילה עודכן בהצלחה' : 'זמן התפילה נוסף בהצלחה');
        setIsAddingNew(false);
        setEditingId(null);
        setNewPrayer({
          name: '',
          time: '',
          dayOfWeek: 0,
          isHoliday: false
        });
        await Promise.all([fetchPrayerTimes(), fetchHolidayPrayers()]);
      } else {
        throw new Error(data.error || 'שגיאה בשמירת זמן התפילה');
      }
    } catch (error) {
      console.error('Error saving prayer time:', error);
      toast.error(error instanceof Error ? error.message : 'שגיאה בשמירת זמן התפילה');
      setError(error instanceof Error ? error.message : 'שגיאה בשמירת זמן התפילה');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (prayer: PrayerTime) => {
    setError(null);
    setNewPrayer({
      name: prayer.name,
      time: prayer.time,
      dayOfWeek: prayer.dayOfWeek,
      isHoliday: prayer.isHoliday
    });
    setEditingId(prayer.id);
    setIsAddingNew(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק זמן תפילה זה?')) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/admin/prayer-times/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.token || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('שגיאה בתקשורת עם השרת');
      }

      const data: ApiResponse<void> = await response.json();

      if (data.success) {
        toast.success('זמן התפילה נמחק בהצלחה');
        await Promise.all([fetchPrayerTimes(), fetchHolidayPrayers()]);
      } else {
        throw new Error(data.error || 'שגיאה במחיקת זמן התפילה');
      }
    } catch (error) {
      console.error('Error deleting prayer time:', error);
      toast.error(error instanceof Error ? error.message : 'שגיאה במחיקת זמן התפילה');
      setError(error instanceof Error ? error.message : 'שגיאה במחיקת זמן התפילה');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E6B87] mx-auto mb-4"></div>
          <p className="text-lg">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1E6B87]">ניהול זמני תפילה</h2>
        <button
          onClick={() => {
            setError(null);
            setIsAddingNew(true);
          }}
          className="bg-[#1E6B87] text-white px-4 py-2 rounded-lg hover:bg-[#154C61] transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1E6B87] focus:ring-offset-2"
          disabled={isLoading || isSaving}
        >
          הוספת זמן תפילה
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-r-4 border-red-400 p-4 rounded-lg" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isAddingNew && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם התפילה</label>
            <input
              type="text"
              value={newPrayer.name}
              onChange={(e) => setNewPrayer({ ...newPrayer, name: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#1E6B87] focus:ring-[#1E6B87] transition-colors duration-200"
              required
              disabled={isSaving}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שעה</label>
            <input
              type="time"
              value={newPrayer.time}
              onChange={(e) => setNewPrayer({ ...newPrayer, time: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#1E6B87] focus:ring-[#1E6B87] transition-colors duration-200"
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isHoliday"
              checked={newPrayer.isHoliday}
              onChange={(e) => setNewPrayer({ ...newPrayer, isHoliday: e.target.checked })}
              className="h-4 w-4 text-[#1E6B87] focus:ring-[#1E6B87] border-gray-300 rounded transition-colors duration-200"
              disabled={isSaving}
            />
            <label htmlFor="isHoliday" className="mr-2 block text-sm font-medium text-gray-700">
              תפילת חג
            </label>
          </div>

          {!newPrayer.isHoliday && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">יום בשבוע</label>
              <select
                value={newPrayer.dayOfWeek}
                onChange={(e) => setNewPrayer({ ...newPrayer, dayOfWeek: parseInt(e.target.value) })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#1E6B87] focus:ring-[#1E6B87] transition-colors duration-200"
                required
                disabled={isSaving}
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
                setError(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E6B87] transition-colors duration-200 disabled:opacity-50"
              disabled={isSaving}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-[#1E6B87] text-white px-6 py-2 rounded-lg hover:bg-[#154C61] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E6B87] transition-colors duration-200 disabled:opacity-50 flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                  שומר...
                </>
              ) : (
                editingId ? 'עדכון' : 'הוספה'
              )}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#1E6B87]">זמני תפילה רגילים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prayerTimes.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-8 bg-gray-50 rounded-lg">לא נמצאו זמני תפילה</p>
            ) : (
              prayerTimes.map((prayer) => (
                <div key={prayer.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
                  <h4 className="font-semibold text-lg text-[#1E6B87] mb-2">{prayer.name}</h4>
                  <p className="text-gray-600 mb-1">יום: {DAYS_OF_WEEK[prayer.dayOfWeek]}</p>
                  <p className="text-gray-600 mb-3">שעה: {prayer.time}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(prayer)}
                      className="text-[#1E6B87] hover:text-[#154C61] disabled:opacity-50 transition-colors duration-200"
                      disabled={isLoading || isSaving}
                      aria-label="ערוך זמן תפילה"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors duration-200"
                      disabled={isLoading || isSaving}
                      aria-label="מחק זמן תפילה"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#1E6B87]">תפילות חג</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidayPrayers.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-8 bg-gray-50 rounded-lg">לא נמצאו תפילות חג</p>
            ) : (
              holidayPrayers.map((prayer) => (
                <div key={prayer.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
                  <h4 className="font-semibold text-lg text-[#1E6B87] mb-2">{prayer.name}</h4>
                  <p className="text-gray-600 mb-3">שעה: {prayer.time}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(prayer)}
                      className="text-[#1E6B87] hover:text-[#154C61] disabled:opacity-50 transition-colors duration-200"
                      disabled={isLoading || isSaving}
                      aria-label="ערוך תפילת חג"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors duration-200"
                      disabled={isLoading || isSaving}
                      aria-label="מחק תפילת חג"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
