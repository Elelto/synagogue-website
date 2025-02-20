import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'תפילת שחרית',
      time: '06:30',
      days: ['כל יום']
    }
  ]);
});

export { router as prayerTimesRouter };
