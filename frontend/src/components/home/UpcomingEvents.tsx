import React from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
}

export const UpcomingEvents: React.FC = () => {
  const events: Event[] = [
    {
      id: 1,
      title: "שיעור תורה שבועי",
      date: "יום שני",
      time: "20:00",
      description: "שיעור בפרשת השבוע עם הרב"
    },
    {
      id: 2,
      title: "תפילת שחרית",
      date: "כל יום",
      time: "06:30",
      description: "תפילת שחרית יומית"
    },
    {
      id: 3,
      title: "סעודה שלישית",
      date: "שבת",
      time: "שעה לפני השקיעה",
      description: "סעודה שלישית וזמירות שבת"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">אירועים קרובים</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-gray-200 p-6 shadow-md transition hover:shadow-lg"
            >
              <div className="mb-4 text-blue-600">
                <span className="text-lg font-semibold">{event.date}</span>
                <span className="mx-2">|</span>
                <span>{event.time}</span>
              </div>
              <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
