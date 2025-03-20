'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';

interface Announcement {
  id: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function AnnouncementsAdmin() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL is not defined');
        toast.error('שגיאת תצורה');
        return;
      }

      const response = await fetch(`${apiUrl}/api/announcements`, {
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.data || []);
      } else {
        console.error('Failed to fetch announcements:', response.status);
        toast.error('שגיאה בטעינת ההודעות');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('שגיאה בטעינת ההודעות');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL is not defined');
        toast.error('שגיאת תצורה');
        return;
      }

      const url = editingId 
        ? `${apiUrl}/api/announcements/${editingId}`
        : `${apiUrl}/api/announcements`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session?.user as any)?.token || ''}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingId ? 'ההודעה עודכנה בהצלחה' : 'ההודעה נוצרה בהצלחה');
        setIsAddingNew(false);
        setEditingId(null);
        setFormData({
          title: '',
          content: '',
          startDate: '',
          endDate: '',
          isActive: true
        });
        fetchAnnouncements();
      } else {
        console.error('Failed to save announcement:', response.status);
        toast.error('שגיאה בשמירת ההודעה');
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('שגיאה בשמירת ההודעה');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      startDate: announcement.startDate.split('T')[0],
      endDate: announcement.endDate.split('T')[0],
      isActive: announcement.isActive
    });
    setEditingId(announcement.id);
    setIsAddingNew(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק הודעה זו?')) return;

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL is not defined');
        toast.error('שגיאת תצורה');
        return;
      }

      const response = await fetch(`${apiUrl}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.token || ''}`
        }
      });

      if (response.ok) {
        toast.success('ההודעה נמחקה בהצלחה');
        fetchAnnouncements();
      } else {
        console.error('Failed to delete announcement:', response.status);
        toast.error('שגיאה במחיקת ההודעה');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('שגיאה במחיקת ההודעה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1E6B87]">ניהול הודעות</h1>
        <button
          onClick={() => setIsAddingNew(true)}
          disabled={loading}
          className="bg-[#1E6B87] text-white px-6 py-2 rounded-lg hover:bg-[#154C61] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="הוספת הודעה חדשה"
        >
          {loading ? 'טוען...' : 'הוספת הודעה חדשה'}
        </button>
      </div>

      {isAddingNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-[#1E6B87]">
              {editingId ? 'עריכת הודעה' : 'הוספת הודעה חדשה'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  כותרת
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                  required
                  dir="rtl"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  תוכן
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                  rows={4}
                  required
                  dir="rtl"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    תאריך התחלה
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    תאריך סיום
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-[#1E6B87] focus:ring-[#1E6B87]"
                    disabled={loading}
                  />
                  <span className="mr-2 text-sm text-gray-700">הודעה פעילה</span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingId(null);
                    setFormData({
                      title: '',
                      content: '',
                      startDate: '',
                      endDate: '',
                      isActive: true
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  disabled={loading}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E6B87] text-white rounded-lg hover:bg-[#154C61] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'שומר...' : (editingId ? 'עדכון' : 'הוספה')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {loading && !isAddingNew ? (
          <div className="text-center py-12 text-gray-500">טוען הודעות...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">אין הודעות להצגה</div>
        ) : (
          announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden border-r-4 ${
                announcement.isActive ? 'border-[#1E6B87]' : 'border-gray-300'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-[#1E6B87] mb-2">
                    {announcement.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-[#1E6B87] hover:text-[#154C61] transition-colors duration-200 disabled:opacity-50"
                      disabled={loading}
                      aria-label="עריכת הודעה"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                      disabled={loading}
                      aria-label="מחיקת הודעה"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {announcement.content}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>מ-{new Date(announcement.startDate).toLocaleDateString('he-IL')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>עד-{new Date(announcement.endDate).toLocaleDateString('he-IL')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      announcement.isActive 
                        ? 'bg-[#1E6B87] bg-opacity-10 text-[#1E6B87]' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {announcement.isActive ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
