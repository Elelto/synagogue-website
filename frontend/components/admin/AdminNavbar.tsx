'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface AdminUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  username: string;
}

export function AdminNavbar() {
  const { data: session } = useSession();
  const user = session?.user as AdminUser | undefined;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/admin"
              className="text-gray-800 hover:text-blue-600 transition-colors duration-300 font-semibold"
            >
              ניהול האתר
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user?.username && (
              <span className="text-gray-600 ml-4">
                שלום, {session.user.username}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors duration-300"
            >
              התנתק
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
