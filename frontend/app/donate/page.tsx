'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScrollAnimation } from '../../components/shared/ScrollAnimation';
import { createPaymentPage } from '../../lib/payplus';

type DonationFormData = {
  amount: number;
  name: string;
  email: string;
  dedication?: string;
};

export default function DonatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams?.get('error') === 'payment-failed' ? 'התשלום נכשל, אנא נסה שוב' : null
  );
  
  const { register, handleSubmit, formState: { errors } } = useForm<DonationFormData>();
  const [selectedAmount, setSelectedAmount] = useState<number>(180);

  const predefinedAmounts = [36, 72, 180, 360, 1800];

  const onSubmit = async (data: DonationFormData) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const paymentPageUrl = await createPaymentPage({
        amount: selectedAmount,
        name: data.name,
        email: data.email,
        dedication: data.dedication
      });
      
      if (paymentPageUrl) {
        window.location.href = paymentPageUrl;
      } else {
        throw new Error('לא הצלחנו ליצור את דף התשלום');
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      setError('אירעה שגיאה בעיבוד התשלום, אנא נסה שוב מאוחר יותר');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#87CEEB] py-12">
      <div className="container mx-auto px-4">
        <ScrollAnimation direction="down" delay={0.2}>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-center mb-8 hebrew-text">תרומה לבית הכנסת</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-right hebrew-text">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-xl text-right hebrew-text">סכום התרומה</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSelectedAmount(amount)}
                      className={`p-4 text-lg rounded-lg transition-all duration-300 hebrew-text
                        ${selectedAmount === amount
                          ? 'bg-[#C6A45C] text-white border-2 border-[#1E6B87]'
                          : 'bg-gray-100 hover:bg-[#D4AF37] hover:text-white'
                        }`}
                    >
                      ₪{amount}
                    </button>
                  ))}
                </div>
                
                <input
                  type="number"
                  {...register('amount', { required: true, min: 1 })}
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg text-right"
                  dir="rtl"
                />
                {errors.amount && (
                  <p className="text-red-500 text-right hebrew-text">אנא הזן סכום תקין</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xl text-right hebrew-text">שם מלא</label>
                  <input
                    type="text"
                    {...register('name', { required: true })}
                    className="w-full p-3 border rounded-lg text-right"
                    dir="rtl"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-right hebrew-text">אנא הזן שם מלא</p>
                  )}
                </div>

                <div>
                  <label className="block text-xl text-right hebrew-text">דוא״ל</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                    })}
                    className="w-full p-3 border rounded-lg text-right"
                    dir="rtl"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-right hebrew-text">אנא הזן כתובת דוא״ל תקינה</p>
                  )}
                </div>

                <div>
                  <label className="block text-xl text-right hebrew-text">הקדשה (אופציונלי)</label>
                  <textarea
                    {...register('dedication')}
                    className="w-full p-3 border rounded-lg text-right"
                    rows={3}
                    dir="rtl"
                    placeholder="לדוגמה: לרפואת..."
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-10 py-5 text-2xl font-bold text-white bg-[#C6A45C] hover:bg-[#D4AF37] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] disabled:opacity-50"
                >
                  {isProcessing ? 'מעבד...' : 'המשך לתשלום'}
                </button>
              </div>
            </form>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
