import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

router.get('/', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing coordinates'
      });
    }

    const cacheKey = `zmanim-${latitude}-${longitude}-${new Date().toISOString().split('T')[0]}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData
      });
    }

    // Get daily times
    const zmanimResponse = await axios.get(
      `https://www.hebcal.com/zmanim?cfg=json&latitude=${latitude}&longitude=${longitude}&date=${new Date().toISOString().split('T')[0]}&tzid=Asia/Jerusalem`
    );

    // Get holiday information
    const holidayResponse = await axios.get(
      `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=now&ss=on&geo=pos&latitude=${latitude}&longitude=${longitude}&tzid=Asia/Jerusalem&M=on&s=on`
    );

    // לוג לבדיקת הזמנים
    console.log('Raw Zmanim Response:', zmanimResponse.data);

    const combinedData = {
      zmanim: zmanimResponse.data,
      holidays: holidayResponse.data
    };

    cache.set(cacheKey, combinedData);

    res.json({
      success: true,
      data: combinedData
    });
  } catch (error) {
    console.error('Error fetching zmanim:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zmanim'
    });
  }
});

export default router;
