'use client';

import React, { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (formData.name.length < 2) {
      newErrors.name = 'שם חייב להכיל לפחות 2 תווים';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    
    if (formData.message.length < 10) {
      newErrors.message = 'ההודעה חייבת להכיל לפחות 10 תווים';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors) {
          const serverErrors: FormErrors = {};
          responseData.errors.forEach((error: string) => {
            if (error.includes('שם')) serverErrors.name = error;
            else if (error.includes('אימייל')) serverErrors.email = error;
            else if (error.includes('הודעה')) serverErrors.message = error;
            else serverErrors.general = error;
          });
          setErrors(serverErrors);
          return;
        }
        throw new Error(responseData.message || 'שגיאה בשליחת הטופס');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error details:', err);
      setErrors({ general: err instanceof Error ? err.message : 'אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // נקה את השגיאה של השדה הזה כשהמשתמש מתחיל להקליד
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#1E6B87] mb-6 text-center">צור קשר</h2>
      
      {success ? (
        <div className="bg-[#E6EEF2] p-4 rounded-md text-[#1E6B87] text-center mb-6">
          <p>תודה על פנייתך! נחזור אליך בהקדם.</p>
          <button
            onClick={() => setSuccess(false)}
            className="relative mt-4 px-6 py-3 bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] text-white rounded-md border-2 border-[#1E6B87] transition-colors duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
            שלח הודעה נוספת
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <div className="bg-[#E6EEF2] p-4 rounded-md text-[#1E6B87] mb-6">
              <ul className="list-disc list-inside">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-[#1E6B87] mb-2 font-semibold">
              שם מלא
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border-2 rounded-md focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent ${
                errors.name ? 'border-[#1E6B87]' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-[#1E6B87]">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-[#1E6B87] mb-2 font-semibold">
              דואר אלקטרוני
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border-2 rounded-md focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent ${
                errors.email ? 'border-[#1E6B87]' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-[#1E6B87]">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-[#1E6B87] mb-2 font-semibold">
              הודעה
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-2 border-2 rounded-md focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent ${
                errors.message ? 'border-[#1E6B87]' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-[#1E6B87]">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative w-full py-3 px-6 text-white rounded-md border-2 border-[#1E6B87] transition-colors duration-300 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-b from-[#F3DF8A] via-[#E5B94E] to-[#D1A73C] hover:from-[#E5B94E] hover:via-[#D1A73C] hover:to-[#C49932] overflow-hidden group'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-shine animate-shine"></div>
            {isSubmitting ? 'שולח...' : 'שלח הודעה'}
          </button>
        </form>
      )}
    </div>
  );
}
