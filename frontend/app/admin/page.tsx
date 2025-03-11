'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">טוען...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-right">ברוכים הבאים למערכת הניהול</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-right">ניהול גלריות תמונות</h3>
          <p className="text-gray-600 mb-4 text-right">הוספה, עריכה ומחיקה של תמונות וקטגוריות</p>
          <a href="/admin/images" className="text-blue-600 hover:text-blue-800 font-medium text-right block">
            ניהול תמונות →
          </a>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-right">זמני תפילה</h3>
          <p className="text-gray-600 mb-4 text-right">עדכון זמני התפילות לימי חול ושבת</p>
          <a href="/admin/prayers" className="text-green-600 hover:text-green-800 font-medium text-right block">
            ניהול זמני תפילה →
          </a>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-right">הודעות ועדכונים</h3>
          <p className="text-gray-600 mb-4 text-right">פרסום והסרה של הודעות חשובות</p>
          <a href="/admin/announcements" className="text-purple-600 hover:text-purple-800 font-medium text-right block">
            ניהול הודעות →
          </a>
        </div>
      </div>
    </div>
  );
}
