'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { MemorialCalendar } from '@/components/memorial/HebrewCalendar';
import { ScrollAnimation } from '@/components/shared/ScrollAnimation';

export default function MemorialPage() {
  return (
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      currency: "ILS",
      intent: "capture"
    }}>
      <div className="min-h-screen bg-gradient-to-b from-orange-100 via-amber-100 to-white py-12">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="down" delay={0.2}>
            <h1 className="text-4xl font-bold text-center text-amber-950 mb-4">נרות נשמה</h1>
            <p className="text-center text-amber-900 mb-12 max-w-2xl mx-auto leading-relaxed">
              הדלקת נר נשמה היא מסורת יהודית עתיקה לזכר יקירינו. 
              בחרו יום משמעותי בלוח השנה העברי והדליקו נר וירטואלי לעילוי נשמת יקיריכם.
            </p>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.4}>
            <MemorialCalendar />
          </ScrollAnimation>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
