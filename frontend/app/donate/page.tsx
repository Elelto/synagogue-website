'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollAnimation } from '../../components/shared/ScrollAnimation';

type DonationFormData = {
  amount: number;
  name: string;
  email: string;
  phone: string;
  dedication?: string;
  // שדות הוראת קבע
  chargeDay?: number;
  numPayments?: number;
  startDate?: string;
  endDate?: string;
};

export default function DonatePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donationType, setDonationType] = useState<'single' | 'recurring' | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DonationFormData>();
  const [selectedAmount, setSelectedAmount] = useState<number>(180);

  const predefinedAmounts = [36, 72, 180, 360, 1800];

  const onSubmit = async (data: DonationFormData) => {
    if (!donationType) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payments/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount,
          name: data.name,
          email: data.email,
          phone: data.phone,
          dedication: data.dedication,
          paymentType: donationType,
          ...(donationType === 'recurring' ? {
            recurringConfig: {
              chargeDay: data.chargeDay || 1,
              numPayments: data.numPayments,
              startDate: data.startDate,
              endDate: data.endDate
            }
          } : {})
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'אירעה שגיאה בעיבוד התשלום');
      }
      
      if (result.url) {
        window.location.href = result.url;
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
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-center mb-8 hebrew-text">תרומה לבית הכנסת</h1>
            
            {!donationType ? (
              <div className="space-y-6">
                <h2 className="text-2xl text-center mb-8 hebrew-text">בחר את סוג התרומה</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button
                    onClick={() => setDonationType('single')}
                    className="relative px-10 py-5 text-2xl font-bold text-white bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
                    תרומה חד פעמית
                  </button>
                  <button
                    onClick={() => setDonationType('recurring')}
                    className="relative px-10 py-5 text-2xl font-bold text-white bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
                    הוראת קבע
                  </button>
                </div>
              </div>
            ) : (
              <div>
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
                          className={`relative p-4 text-lg rounded-lg transition-all duration-300 hebrew-text
                            ${selectedAmount === amount
                              ? 'bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] text-white border-2 border-[#1E6B87]'
                              : 'bg-gray-100 hover:bg-gradient-to-b from-[#E5B94E] via-[#D1A73C] to-[#C49932] hover:text-white'
                            } overflow-hidden group`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
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
                      <label className="block text-xl text-right hebrew-text">טלפון</label>
                      <input
                        type="tel"
                        {...register('phone', { 
                          required: true,
                          pattern: /^[0-9]{9,10}$/
                        })}
                        className="w-full p-3 border rounded-lg text-right"
                        dir="rtl"
                        placeholder="0501234567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-right hebrew-text">אנא הזן מספר טלפון תקין</p>
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

                    {donationType === 'recurring' && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-xl font-bold text-right hebrew-text">הגדרות הוראת קבע</h3>
                        
                        <div>
                          <label className="block text-lg text-right hebrew-text">יום החיוב בחודש</label>
                          <input
                            type="number"
                            {...register('chargeDay', { 
                              required: true,
                              min: 1,
                              max: 28
                            })}
                            defaultValue={1}
                            className="w-full p-3 border rounded-lg text-right"
                            dir="rtl"
                          />
                          {errors.chargeDay && (
                            <p className="text-red-500 text-right hebrew-text">אנא בחר יום בין 1 ל-28</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-lg text-right hebrew-text">מספר תשלומים (השאר ריק לתשלום ללא הגבלה)</label>
                          <input
                            type="number"
                            {...register('numPayments', { 
                              min: 1
                            })}
                            className="w-full p-3 border rounded-lg text-right"
                            dir="rtl"
                          />
                          {errors.numPayments && (
                            <p className="text-red-500 text-right hebrew-text">אנא הזן מספר תשלומים תקין</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-lg text-right hebrew-text">תאריך התחלה</label>
                          <input
                            type="date"
                            {...register('startDate')}
                            className="w-full p-3 border rounded-lg text-right"
                            dir="rtl"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div>
                          <label className="block text-lg text-right hebrew-text">תאריך סיום (אופציונלי)</label>
                          <input
                            type="date"
                            {...register('endDate')}
                            className="w-full p-3 border rounded-lg text-right"
                            dir="rtl"
                            min={watch('startDate') || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="relative px-10 py-5 text-2xl font-bold text-white bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] disabled:opacity-50 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
                      {isProcessing ? 'מעבד...' : 'המשך לתשלום'}
                    </button>
                  </div>
                </form>

                <button
                  onClick={() => setDonationType(null)}
                  className="relative mt-4 px-6 py-2 text-lg font-bold text-white bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] rounded-full shadow-lg transition-all duration-300 hebrew-text border-2 border-[#1E6B87] overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
                  חזרה לבחירת סוג תרומה
                </button>
              </div>
            )}
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
