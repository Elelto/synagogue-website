import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'שיעור תורה שבועי',
      description: 'שיעור בפרשת השבוע עם הרב',
      date: '2025-02-18T20:00:00.000Z',
      type: 'weekly'
    }
  ]);
});

export { router as eventsRouter };
