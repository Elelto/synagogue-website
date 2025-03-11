import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { eventsRouter } from './routes/events'
import { prayerTimesRouter } from './routes/prayerTimes'
import { announcementsRouter } from './routes/announcements'
import { contactRouter } from './routes/contact'
import { hebrewCalendarRouter } from './routes/hebrewCalendar'
import { memorialDaysRouter } from './routes/memorialDays'
import { authRouter } from './routes/auth'
import imagesRouter from './routes/admin/images'

// Load .env after process.env to give priority to PM2 environment variables
const existingEnv = { ...process.env }
dotenv.config()
Object.assign(process.env, { ...existingEnv, ...process.env })

// Validate required environment variables
const requiredEnvVars = ['NEXTAUTH_SECRET', 'PORT', 'NODE_ENV'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} environment variable is required`);
  }
}

const app = express()
const prisma = new PrismaClient()

// Ensure PORT is always 3001 in development
const port = process.env.NODE_ENV === 'development' 
  ? 3001 
  : Number(process.env.PORT) || 3001;

// Configure CORS for development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    environment: process.env.NODE_ENV,
    port
  })
})

// API Routes
const apiRouter = express.Router()

// Auth routes
apiRouter.use('/auth', authRouter)

// Public routes
apiRouter.use('/events', eventsRouter)
apiRouter.use('/prayer-times', prayerTimesRouter)
apiRouter.use('/announcements', announcementsRouter)
apiRouter.use('/contact', contactRouter)
apiRouter.use('/hebrew-calendar', hebrewCalendarRouter)
apiRouter.use('/memorial-days', memorialDaysRouter)

// Admin routes
apiRouter.use('/admin/images', imagesRouter)
apiRouter.use('/admin/prayer-times', prayerTimesRouter)
apiRouter.use('/admin/announcements', announcementsRouter)

// Mount all routes under /api
app.use('/api', apiRouter)

// Static files for uploaded images
app.use('/uploads', express.static('uploads'))

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  })
  
  res.status(500).json({ 
    success: false,
    error: 'אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.'
  })
})

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'הדף המבוקש לא נמצא'
  })
})

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`)
  console.log(`Health check available at http://localhost:${port}/health`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    prisma.$disconnect()
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
