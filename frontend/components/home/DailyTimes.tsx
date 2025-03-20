'use client';

import React, { useState, useEffect } from 'react';

interface Coordinates {
  latitude: string;
  longitude: string;
  cityName: string;
}

interface ZmanTime {
  title: string;
  time: string;
  category?: 'regular' | 'shabbat' | 'holiday';
}

interface HebcalResponse {
  success: boolean;
  data: {
    zmanim: {
      times: {
        alot: string;             // עלות השחר
        misheyakir: string;       // משיכיר
        sunrise: string;          // הנץ החמה
        sofZmanShma: string;      // סוף זמן ק"ש
        sofZmanTfilla: string;    // סוף זמן תפילה
        chatzot: string;          // חצות
        minchaGedola: string;     // מנחה גדולה
        minchaKetana: string;     // מנחה קטנה
        plagHaMincha: string;     // פלג המנחה
        sunset: string;           // שקיעה
        tzeit42min: string;       // צאת הכוכבים 42 דקות
        tzeit72min: string;       // ר"ת 72 דקות
      };
    };
    holidays: {
      items: Array<{
        title: string;
        category: string;
        date: string;
        candlelighting?: string;
        havdalah?: string;
      }>;
    };
  };
}

// קואורדינטות ברירת מחדל - בני ברק
const DEFAULT_COORDINATES: Coordinates = {
  latitude: '32.0853',
  longitude: '34.8338',
  cityName: 'בני ברק'
};

export function DailyTimes() {
  const [zmanim, setZmanim] = useState<ZmanTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>(DEFAULT_COORDINATES);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=he`
            );
            const data = await response.json();
            
            setCoordinates({
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
              cityName: data.address.city || data.address.town || data.address.village || 'מיקומך הנוכחי'
            });
          } catch (error) {
            console.error('Error getting city name:', error);
            setCoordinates({
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
              cityName: 'מיקומך הנוכחי'
            });
          }
        },
        (error) => {
          console.log('Error getting location:', error);
          setLocationPermissionDenied(true);
        }
      );
    };

    getUserLocation();
  }, []);

  const fetchZmanim = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      const response = await fetch(
        `${apiUrl}/api/zmanim?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
      );

      if (!response.ok) {
        throw new Error('שגיאה בטעינת הזמנים');
      }

      const data: HebcalResponse = await response.json();

      if (!data.success) {
        throw new Error(data.data?.toString() || 'שגיאה בטעינת הזמנים');
      }

      const formatTime = (isoTime: string) => {
        if (!isoTime) return '';
        const time = new Date(isoTime);
        return time.toLocaleTimeString('he-IL', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      };

      // זמני היום הרגילים
      const dailyTimes: ZmanTime[] = [
        { title: 'עלות השחר', time: formatTime(data.data.zmanim.times.alot), category: 'regular' },
        { title: 'משיכיר', time: formatTime(data.data.zmanim.times.misheyakir), category: 'regular' },
        { title: 'הנץ החמה', time: formatTime(data.data.zmanim.times.sunrise), category: 'regular' },
        { title: 'סוף זמן ק"ש', time: formatTime(data.data.zmanim.times.sofZmanShma), category: 'regular' },
        { title: 'סוף זמן תפילה', time: formatTime(data.data.zmanim.times.sofZmanTfilla), category: 'regular' },
        { title: 'חצות', time: formatTime(data.data.zmanim.times.chatzot), category: 'regular' },
        { title: 'מנחה גדולה', time: formatTime(data.data.zmanim.times.minchaGedola), category: 'regular' },
        { title: 'מנחה קטנה', time: formatTime(data.data.zmanim.times.minchaKetana), category: 'regular' },
        { title: 'פלג המנחה', time: formatTime(data.data.zmanim.times.plagHaMincha), category: 'regular' },
        { title: 'שקיעה', time: formatTime(data.data.zmanim.times.sunset), category: 'regular' },
        { title: 'צאת הכוכבים', time: formatTime(data.data.zmanim.times.tzeit42min), category: 'regular' },
        { title: 'ר"ת', time: formatTime(data.data.zmanim.times.tzeit72min), category: 'regular' }
      ];

      // מציאת זמני שבת/חג להיום
      const today = new Date().toISOString().split('T')[0];
      const specialTimes = data.data.holidays.items
        .filter(item => item.date.startsWith(today))
        .map(item => {
          const times: ZmanTime[] = [];
          if (item.candlelighting) {
            times.push({
              title: `הדלקת נרות ${item.category === 'holiday' ? item.title : 'שבת'}`,
              time: formatTime(item.candlelighting),
              category: item.category === 'holiday' ? 'holiday' : 'shabbat'
            });
          }
          if (item.havdalah) {
            times.push({
              title: `צאת ${item.category === 'holiday' ? item.title : 'שבת'}`,
              time: formatTime(item.havdalah),
              category: item.category === 'holiday' ? 'holiday' : 'shabbat'
            });
          }
          return times;
        })
        .flat();

      setZmanim([...dailyTimes, ...specialTimes]);
    } catch (err) {
      console.error('Error fetching zmanim:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת הזמנים');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchZmanim();
    // מעדכן כל שעה
    const interval = setInterval(() => fetchZmanim(true), 3600000);
    return () => clearInterval(interval);
  }, [coordinates]);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">זמני היום</h2>
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C6A45C]"></div>
          <div className="text-gray-600 mr-2">טוען זמנים...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#1E6B87]">זמני היום</h2>
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => setCoordinates(DEFAULT_COORDINATES)} 
            className="mt-4 px-6 py-2 bg-[#C6A45C] text-white rounded-full hover:bg-[#D4AF37] transition-all duration-300 disabled:opacity-50 border-2 border-[#1E6B87]"
          >
            הצג זמנים לפי בני ברק
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#1E6B87]">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-[#1E6B87]">
          זמני היום
          <div className="text-sm font-normal text-gray-600 mt-1">
            {locationPermissionDenied ? 
              'מוצג לפי אופק בני ברק' : 
              `מוצג לפי אופק ${coordinates.cityName}`
            }
          </div>
        </h2>
        <button
          onClick={() => fetchZmanim(true)}
          disabled={isRefreshing}
          className="text-[#1E6B87] hover:text-[#C6A45C] transition-colors duration-300"
          title="רענן זמנים"
        >
          <svg className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {zmanim.map((zman, index) => (
          <div 
            key={index} 
            className={`text-center p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
              zman.category === 'shabbat' 
                ? 'bg-gray-50/80 border-2 border-[#4A5568] hover:bg-gray-100/80' 
                : zman.category === 'holiday'
                ? 'bg-yellow-50/80 border-2 border-[#C6A45C] hover:bg-yellow-100/80'
                : 'bg-white/80 border-2 border-[#1E6B87] hover:bg-[#1E6B87]/5'
            }`}
          >
            <div className={`font-bold mb-2 ${
              zman.category === 'shabbat'
                ? 'text-[#4A5568]'
                : zman.category === 'holiday'
                ? 'text-[#C6A45C]'
                : 'text-[#1E6B87]'
            }`}>
              {zman.title}
            </div>
            <div className={`text-lg font-semibold ${
              zman.category === 'shabbat'
                ? 'text-[#4A5568]'
                : zman.category === 'holiday'
                ? 'text-[#C6A45C]'
                : 'text-[#1E6B87]'
            }`}>
              {zman.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
