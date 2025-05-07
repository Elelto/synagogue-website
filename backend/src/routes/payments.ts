import express from 'express';
import { createPaymentPage, getTransactions, getObligations } from '../services/kesher';

const router = express.Router();

router.post('/create-payment', async (req, res) => {
  try {
    const { amount, name, email, phone, dedication, paymentType } = req.body;

    if (!amount || !name || !email || !phone || !paymentType) {
      return res.status(400).json({ error: 'חסרים שדות חובה' });
    }

    const paymentPageUrl = await createPaymentPage({
      amount,
      name,
      email,
      phone,
      dedication,
      paymentType,
    });

    res.json({ url: paymentPageUrl });
  } catch (error) {
    console.error('Error in create-payment route:', error);
    res.status(500).json({ error: 'אירעה שגיאה ביצירת דף התשלום' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'חסרים תאריכים' });
    }

    const transactions = await getTransactions(fromDate as string, toDate as string);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'אירעה שגיאה בשליפת העסקאות' });
  }
});

router.get('/obligations', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'חסרים תאריכים' });
    }

    const obligations = await getObligations(fromDate as string, toDate as string);
    res.json(obligations);
  } catch (error) {
    console.error('Error fetching obligations:', error);
    res.status(500).json({ error: 'אירעה שגיאה בשליפת ההתחייבויות' });
  }
});

export default router;
