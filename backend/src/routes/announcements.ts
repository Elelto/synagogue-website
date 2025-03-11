import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateAdmin } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = express.Router();

// Validation schemas
const announcementSchema = z.object({
  title: z.string().min(1, 'כותרת היא שדה חובה'),
  content: z.string().min(1, 'תוכן הוא שדה חובה'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'פורמט תאריך לא תקין (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'פורמט תאריך לא תקין (YYYY-MM-DD)'),
  isActive: z.boolean().default(true)
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: 'תאריך התחלה חייב להיות לפני תאריך סיום'
});

// Public route - Get active announcements
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: currentDate
        },
        endDate: {
          gte: currentDate
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    res.json({
      success: true,
      data: announcements,
      message: 'הודעות פעילות'
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ 
      success: false, 
      error: 'אירעה שגיאה בטעינת ההודעות' 
    });
  }
});

// Admin routes
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const validationResult = announcementSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.errors[0].message
      });
    }

    const { title, content, startDate, endDate, isActive } = validationResult.data;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive
      }
    });

    res.json({
      success: true,
      data: announcement,
      message: 'ההודעה נוצרה בהצלחה'
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'אירעה שגיאה ביצירת הודעה חדשה' 
    });
  }
});

router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'מזהה הודעה לא תקין'
      });
    }

    const validationResult = announcementSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.errors[0].message
      });
    }

    const { title, content, startDate, endDate, isActive } = validationResult.data;

    const announcement = await prisma.announcement.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive
      }
    });

    res.json({
      success: true,
      data: announcement,
      message: 'ההודעה עודכנה בהצלחה'
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'ההודעה לא נמצאה'
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'אירעה שגיאה בעדכון ההודעה' 
    });
  }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'מזהה הודעה לא תקין'
      });
    }

    await prisma.announcement.delete({
      where: { id: parseInt(id) }
    });

    res.json({ 
      success: true,
      message: 'ההודעה נמחקה בהצלחה'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'ההודעה לא נמצאה'
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'אירעה שגיאה במחיקת ההודעה' 
    });
  }
});

export { router as announcementsRouter };
