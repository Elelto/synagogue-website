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

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const port = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' })
})

// Routes
app.use('/api/events', eventsRouter)
app.use('/api/prayer-times', prayerTimesRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/hebrew-calendar', hebrewCalendarRouter)
app.use('/api/memorial-days', memorialDaysRouter)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    prisma.$disconnect()
  })
})
