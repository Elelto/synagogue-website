'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession();
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
      const response = await fetch('/api/admin/prayer-times', {
        headers: {
          'Authorization': `Bearer ${(session as any).token}`
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
      setError(error instanceof Error ? error.message : 'שגיאה בטעינת זמני התפילה');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHolidayPrayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/prayer-times?holiday=true', {
        headers: {
          'Authorization': `Bearer ${(session as any).token}`
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
        ? `/api/admin/prayer-times/${editingId}`
        : '/api/admin/prayer-times';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).token}`
        },
        body: JSON.stringify(newPrayer),
      });

      if (!response.ok) {
        throw new Error('שגיאה בתקשורת עם השרת');
      }

      const data: ApiResponse<PrayerTime> = await response.json();

      if (data.success) {
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
      const response = await fetch(`/api/admin/prayer-times/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(session as any).token}`
        }
      });

      if (!response.ok) {
        throw new Error('שגיאה בתקשורת עם השרת');
      }

      const data: ApiResponse<void> = await response.json();

      if (data.success) {
        await Promise.all([fetchPrayerTimes(), fetchHolidayPrayers()]);
      } else {
        throw new Error(data.error || 'שגיאה במחיקת זמן התפילה');
      }
    } catch (error) {
      console.error('Error deleting prayer time:', error);
      setError(error instanceof Error ? error.message : 'שגיאה במחיקת זמן התפילה');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">טוען...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">אנא התחבר כדי לנהל את זמני התפילה</p>
          <a href="/admin/login" className="text-blue-500 hover:text-blue-700 underline">
            התחברות למערכת
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול זמני תפילה</h2>
        <button
          onClick={() => {
            setError(null);
            setIsAddingNew(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading || isSaving}
        >
          הוספת זמן תפילה
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">סגור</span>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {isAddingNew && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">שם התפילה</label>
            <input
              type="text"
              value={newPrayer.name}
              onChange={(e) => setNewPrayer({ ...newPrayer, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              dir="rtl"
              disabled={isSaving}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">שעה</label>
            <input
              type="time"
              value={newPrayer.time}
              onChange={(e) => setNewPrayer({ ...newPrayer, time: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={newPrayer.isHoliday}
              onChange={(e) => setNewPrayer({ ...newPrayer, isHoliday: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isSaving}
            />
            <label className="mr-2 block text-sm font-medium text-gray-700">
              תפילת חג
            </label>
          </div>

          {!newPrayer.isHoliday && (
            <div>
              <label className="block text-sm font-medium text-gray-700">יום בשבוע</label>
              <select
                value={newPrayer.dayOfWeek}
                onChange={(e) => setNewPrayer({ ...newPrayer, dayOfWeek: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              disabled={isSaving}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  שומר...
                </>
              ) : (
                editingId ? 'עדכון' : 'הוספה'
              )}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">זמני תפילה רגילים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prayerTimes.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-4">לא נמצאו זמני תפילה</p>
            ) : (
              prayerTimes.map((prayer) => (
                <div key={prayer.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <h4 className="font-semibold">{prayer.name}</h4>
                  <p>יום: {DAYS_OF_WEEK[prayer.dayOfWeek]}</p>
                  <p>שעה: {prayer.time}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(prayer)}
                      className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      disabled={isLoading || isSaving}
                    >
                      עריכה
                    </button>
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={isLoading || isSaving}
                    >
                      מחיקה
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">תפילות חג</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidayPrayers.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-4">לא נמצאו תפילות חג</p>
            ) : (
              holidayPrayers.map((prayer) => (
                <div key={prayer.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <h4 className="font-semibold">{prayer.name}</h4>
                  <p>שעה: {prayer.time}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(prayer)}
                      className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      disabled={isLoading || isSaving}
                    >
                      עריכה
                    </button>
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={isLoading || isSaving}
                    >
                      מחיקה
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
