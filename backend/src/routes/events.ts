import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'asc'
      }
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, date, location, time } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        time
      }
    });
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
});

export { router as eventsRouter };
