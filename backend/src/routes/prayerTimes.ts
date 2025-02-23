import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prayerTimes = await prisma.prayerTime.findMany({
      where: {
        isHoliday: false
      },
      orderBy: {
        id: 'asc'
      }
    });

    res.json(prayerTimes);
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    res.status(500).json({ 
      success: false, 
      message: 'אירעה שגיאה בטעינת זמני התפילה' 
    });
  }
});

export { router as prayerTimesRouter };
