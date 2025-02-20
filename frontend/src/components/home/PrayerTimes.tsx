import React from 'react';

interface PrayerTime {
  name: string;
  weekdays: string;
  shabbat: string;
}

export const PrayerTimes: React.FC = () => {
  const prayerTimes: PrayerTime[] = [
    { name: 'שחרית', weekdays: '7:00', shabbat: '8:00' },
    { name: 'מנחה', weekdays: '16:45', shabbat: '16:30' },
    { name: 'ערבית', weekdays: '19:00', shabbat: '19:15' },
  ];

  return (
    <div className="content-box">
      <h2 className="section-title">זמני תפילה</h2>
      <div className="space-y-6">
        {prayerTimes.map((prayer) => (
          <div key={prayer.name} className="flex flex-col space-y-2">
            <h3 className="text-2xl font-bold text-[#8B4513] hebrew-text">{prayer.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div>
                <span className="font-medium text-[#B8860B]">ימות החול: </span>
                <span className="text-[#1C1C1C]">{prayer.weekdays}</span>
              </div>
              <div>
                <span className="font-medium text-[#B8860B]">שבת: </span>
                <span className="text-[#1C1C1C]">{prayer.shabbat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
