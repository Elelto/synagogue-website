import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema
const memorialDaySchema = z.object({
  hebrewDate: z.string(),
  gregorianDate: z.string().transform(str => new Date(str)),
  purchasedBy: z.string(),
  dedicatedTo: z.string(),
  message: z.string().optional(),
  paymentId: z.string()
});

// Get all memorial days
router.get('/', async (req, res) => {
  try {
    const memorialDays = await prisma.memorialDay.findMany({
      orderBy: {
        gregorianDate: 'asc'
      }
    });
    res.json(memorialDays);
  } catch (error) {
    console.error('Error fetching memorial days:', error);
    res.status(500).json({ error: 'Error fetching memorial days' });
  }
});

// Create a new memorial day
router.post('/', async (req, res) => {
  try {
    const validatedData = memorialDaySchema.parse(req.body);
    
    // Check if the day is already purchased
    const existingDay = await prisma.memorialDay.findFirst({
      where: {
        hebrewDate: validatedData.hebrewDate
      }
    });

    if (existingDay) {
      return res.status(400).json({ error: 'This day has already been purchased' });
    }

    const memorialDay = await prisma.memorialDay.create({
      data: {
        ...validatedData,
        paymentStatus: 'completed'
      }
    });

    res.status(201).json(memorialDay);
  } catch (error) {
    console.error('Error creating memorial day:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Error creating memorial day' });
    }
  }
});

export { router as memorialDaysRouter };
