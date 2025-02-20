import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    date: new Date(),
    hebrewDate: 'ט׳ באדר א׳ תשפ״ה'
  });
});

export { router as hebrewCalendarRouter };
