import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { eventsRouter } from './routes/events';
import { prayerTimesRouter } from './routes/prayerTimes';
import { announcementsRouter } from './routes/announcements';
import { contactRouter } from './routes/contact';
import { hebrewCalendarRouter } from './routes/hebrewCalendar';
import { memorialDaysRouter } from './routes/memorialDays';
import { authRouter } from './routes/auth';
import { categoriesRouter } from './routes/admin/categories';
import imagesRouter from './routes/admin/images';
import publicImagesRouter from './routes/images';
import zmanimRouter from './routes/zmanim';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT) || 3001;

// Add request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      headers: req.headers,
      query: req.query,
      body: req.body
    });
    next();
  });
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    environment: process.env.NODE_ENV,
    port: port
  });
});

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/prayer-times', prayerTimesRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/hebrew-calendar', hebrewCalendarRouter);
app.use('/api/memorial-days', memorialDaysRouter);
app.use('/api/zmanim', zmanimRouter);
app.use('/auth', authRouter);
app.use('/api/images', publicImagesRouter);

// Admin routes
app.use('/api/admin/announcements', announcementsRouter);
app.use('/api/admin/categories', categoriesRouter);
app.use('/api/admin/images', imagesRouter);

// Static files for uploaded images
app.use('/uploads', express.static('uploads'))

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    headers: req.headers
  })
  
  res.status(500).json({ 
    success: false,
    error: 'אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.'
  })
})

// Handle 404 errors
app.use((req, res) => {
  console.log('404 Not Found:', {
    path: req.path,
    method: req.method,
    headers: req.headers
  });
  res.status(404).json({
    success: false,
    error: 'הדף המבוקש לא נמצא'
  })
})

let server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    prisma.$disconnect()
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    prisma.$disconnect()
    process.exit(0)
  })
})
