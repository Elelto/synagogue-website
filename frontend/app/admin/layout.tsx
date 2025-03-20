'use client';

import { useSession, signOut } from 'next-auth/react';
import AdminWrapper from '@/components/auth/AdminWrapper';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <AdminWrapper>
      <div dir="rtl" className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm fixed top-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-800">ניהול בית הכנסת</h1>
                </div>
                <div className="hidden sm:flex sm:mr-6 gap-8">
                  <Link href="/admin/images" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    גלריית תמונות
                  </Link>
                  <Link href="/admin/prayers" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    זמני תפילה
                  </Link>
                  <Link href="/admin/announcements" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    הודעות
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                {session?.user?.name && (
                  <span className="text-gray-600 ml-4">
                    שלום, {session.user.name}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors duration-300 mr-4"
                >
                  התנתק
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="py-10 mt-16">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AdminWrapper>
  );
}
