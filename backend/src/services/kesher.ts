import axios from 'axios';

interface KesherPaymentConfig {
  amount: number;
  name: string;
  email: string;
  phone: string;
  dedication?: string;
  paymentType: 'single' | 'recurring';
  // הגדרות להוראת קבע
  recurringConfig?: {
    startDate?: string; // תאריך התחלה
    endDate?: string;   // תאריך סיום (אופציונלי)
    chargeDay: number;  // יום החיוב בחודש (1-28)
    numPayments?: number; // מספר תשלומים (אופציונלי, אם לא מוגדר = ללא הגבלה)
  };
}

export async function createPaymentPage(config: KesherPaymentConfig) {
  const { amount, name, email, phone, dedication, paymentType, recurringConfig } = config;
  
  try {
    const response = await axios.post(process.env.KESHER_API_URL!, {
      Json: {
        userName: process.env.KESHER_USERNAME,
        password: process.env.KESHER_PASSWORD,
        format: 'json',
        func: 'SendTransaction',
        terminal: process.env.KESHER_TERMINAL_NUMBER,
        sum: amount * 100, // Convert to agorot
        fullName: name,
        email: email,
        phone: phone,
        comments: dedication || '',
        currency: '1', // 1 = שקל
        paymentType: paymentType === 'single' ? '1' : '10', // 1 = חד פעמי, 10 = הוראת קבע
        maxPayments: paymentType === 'single' ? '1' : (recurringConfig?.numPayments || '0'), // 0 = ללא הגבלה
        successUrl: `${process.env.NEXTAUTH_URL}/donate/thank-you`,
        cancelUrl: `${process.env.NEXTAUTH_URL}/donate`,
        language: 'he', // Hebrew interface
        isTest: process.env.NODE_ENV === 'development' ? '1' : '0',
        // פרמטרים להוראת קבע
        ...(paymentType === 'recurring' && recurringConfig ? {
          startDate: recurringConfig.startDate || new Date().toISOString().split('T')[0],
          endDate: recurringConfig.endDate || '',
          chargeDay: recurringConfig.chargeDay.toString(),
        } : {})
      },
      format: 'json',
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data.url || response.data.paymentPageUrl;
  } catch (error) {
    console.error('Error creating Kesher payment page:', error);
    throw error;
  }
}

export async function getTransactions(fromDate: string, toDate: string) {
  try {
    const response = await axios.post(process.env.KESHER_API_URL!, {
      Json: {
        userName: process.env.KESHER_USERNAME,
        password: process.env.KESHER_PASSWORD,
        format: 'json',
        func: 'GetTrans',
        fromDate,
        toDate
      },
      format: 'json'
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function getObligations(fromDate: string, toDate: string) {
  try {
    const response = await axios.post(process.env.KESHER_API_URL!, {
      Json: {
        userName: process.env.KESHER_USERNAME,
        password: process.env.KESHER_PASSWORD,
        format: 'json',
        func: 'GetObligations',
        fromDate,
        toDate
      },
      format: 'json'
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching obligations:', error);
    throw error;
  }
}
