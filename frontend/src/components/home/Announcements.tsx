import React from 'react';

export const Announcements = () => {
  const announcements = [
    {
      title: 'שיעור שבועי בפרשת השבוע',
      date: 'יום רביעי, כ״א אדר א׳',
      time: '20:00',
      description: 'שיעור מפי הרב בנושא פרשת השבוע'
    },
    {
      title: 'סעודה שלישית',
      date: 'שבת, כ״ד אדר א׳',
      time: '17:00',
      description: 'סעודה שלישית בבית הכנסת עם דברי תורה'
    }
  ];

  return (
    <div className="content-box">
      <h2 className="section-title">הודעות ואירועים</h2>
      <div className="space-y-6">
        {announcements.map((announcement, index) => (
          <div key={index} className="border-r-4 border-[#B8860B] pr-4 py-2">
            <h3 className="text-2xl font-bold text-[#8B4513] hebrew-text mb-2">
              {announcement.title}
            </h3>
            <div className="flex items-center text-[#B8860B] mb-2">
              <span className="text-lg font-medium">{announcement.date}</span>
              <span className="mx-2">•</span>
              <span className="text-lg">{announcement.time}</span>
            </div>
            <p className="text-[#1C1C1C] text-lg">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
      <button className="golden-button w-full mt-8">
        לכל האירועים
      </button>
    </div>
  );
};
