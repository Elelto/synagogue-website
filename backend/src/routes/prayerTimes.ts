import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateAdmin } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = express.Router();

// Validation schemas
const prayerTimeSchema = z.object({
  name: z.string().min(1, 'שם הוא שדה חובה'),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'פורמט שעה לא תקין (HH:MM)'),
  isHoliday: z.boolean(),
  dayOfWeek: z.number().min(0).max(6).nullable()
}).refine(data => {
  if (!data.isHoliday && data.dayOfWeek === null) {
    return false;
  }
  if (data.isHoliday && data.dayOfWeek !== null) {
    return false;
  }
  return true;
}, {
  message: 'יום בשבוע הוא שדה חובה עבור תפילות רגילות ואסור בתפילות חג'
});

// Public route - Get prayer times (regular or holiday)
router.get('/', async (req, res) => {
  const isHoliday = req.query.holiday === 'true';
  try {
    const prayerTimes = await prisma.prayerTime.findMany({
      where: {
        isHoliday
      },
      orderBy: isHoliday 
        ? { time: 'asc' }
        : [
            { dayOfWeek: 'asc' },
            { time: 'asc' }
          ]
    });

    res.json({
      success: true,
      data: prayerTimes,
      message: isHoliday ? 'זמני תפילות החג' : 'זמני תפילות'
    });
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    res.status(500).json({ 
      success: false, 
      error: isHoliday 
        ? 'אירעה שגיאה בטעינת זמני תפילות החג'
        : 'אירעה שגיאה בטעינת זמני התפילה'
    });
  }
});

// Admin route - Create new prayer time
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const validationResult = prayerTimeSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.errors[0].message
      });
    }

    const { name, time, dayOfWeek, isHoliday } = validationResult.data;

    const prayerTime = await prisma.prayerTime.create({
      data: {
        name,
        time,
        dayOfWeek: isHoliday ? null : dayOfWeek,
        isHoliday
      }
    });

    res.json({
      success: true,
      data: prayerTime,
      message: 'זמן התפילה נוצר בהצלחה'
    });
  } catch (error) {
    console.error('Error creating prayer time:', error);
    res.status(500).json({ 
      success: false, 
      error: 'אירעה שגיאה ביצירת זמן תפילה חדש' 
    });
  }
});

// Admin route - Update prayer time
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'מזהה זמן תפילה לא תקין'
      });
    }

    const validationResult = prayerTimeSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.errors[0].message
      });
    }

    const { name, time, dayOfWeek, isHoliday } = validationResult.data;

    const prayerTime = await prisma.prayerTime.update({
      where: { id: parseInt(id) },
      data: {
        name,
        time,
        dayOfWeek: isHoliday ? null : dayOfWeek,
        isHoliday
      }
    });

    res.json({
      success: true,
      data: prayerTime,
      message: 'זמן התפילה עודכן בהצלחה'
    });
  } catch (error) {
    console.error('Error updating prayer time:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'זמן התפילה לא נמצא'
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'אירעה שגיאה בעדכון זמן התפילה' 
    });
  }
});

// Admin route - Delete prayer time
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'מזהה זמן תפילה לא תקין'
      });
    }

    await prisma.prayerTime.delete({
      where: { id: parseInt(id) }
    });

    res.json({ 
      success: true,
      message: 'זמן התפילה נמחק בהצלחה'
    });
  } catch (error) {
    console.error('Error deleting prayer time:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'זמן התפילה לא נמצא'
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'אירעה שגיאה במחיקת זמן התפילה' 
    });
  }
});

export { router as prayerTimesRouter };
