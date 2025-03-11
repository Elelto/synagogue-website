import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import LoginFormClient from '@/components/auth/LoginFormClient';

export const metadata: Metadata = {
  title: 'התחברות - בית הכנסת',
  description: 'התחברות למערכת הניהול של בית הכנסת',
};

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect('/admin');
  }

  const headersList = headers();
  const referer = headersList.get('referer');
  const callbackUrl = referer?.includes('/admin') ? referer : '/admin';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          התחברות למערכת הניהול
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          ברוכים הבאים למערכת הניהול של בית הכנסת
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginFormClient callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
