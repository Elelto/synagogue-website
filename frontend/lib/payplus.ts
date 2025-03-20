import axios from 'axios';
import CryptoJS from 'crypto-js';

interface PaymentPageParams {
  amount: number;
  name: string;
  email: string;
  dedication?: string;
}

export async function createPaymentPage({
  amount,
  name,
  email,
  dedication = ''
}: PaymentPageParams) {
  const apiKey = process.env.PAYPLUS_API_KEY;
  const secretKey = process.env.PAYPLUS_SECRET_KEY;
  
  if (!apiKey || !secretKey) {
    throw new Error('PayPlus API configuration is missing');
  }

  const paymentData = {
    payment_page_uid: apiKey,
    amount: amount,
    currency_code: 'ILS',
    product_name: 'תרומה לבית הכנסת',
    customer: {
      customer_name: name,
      email: email,
      customer_uid: email // Using email as customer ID
    },
    items: [{
      name: 'תרומה',
      quantity: 1,
      price: amount,
      currency_code: 'ILS'
    }],
    more_info: dedication,
    success_url: `${process.env.NEXTAUTH_URL}/donate/thank-you`,
    failure_url: `${process.env.NEXTAUTH_URL}/donate?error=payment-failed`,
    cancel_url: `${process.env.NEXTAUTH_URL}/donate`,
    create_token: false,
    language_code: 'he'
  };

  // Create signature
  const dataString = JSON.stringify(paymentData);
  const signature = CryptoJS.HmacSHA256(dataString, secretKey).toString();

  try {
    const response = await axios.post(
      'https://api.payplus.co.il/api/v1.0/PaymentPages/generateLink',
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
          'X-Signature': signature
        }
      }
    );

    if (response.data.status_code === '0') {
      return response.data.data.payment_page_link;
    } else {
      throw new Error(response.data.status_error_details);
    }
  } catch (error) {
    console.error('Error creating payment page:', error);
    throw error;
  }
}
