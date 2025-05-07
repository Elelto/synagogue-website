import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';

const prisma = new PrismaClient();

async function importData() {
  try {
    const data = JSON.parse(fs.readFileSync('exported-data.json', 'utf-8'));

    // Import announcements
    for (const announcement of data.announcements) {
      await prisma.announcement.create({
        data: {
          ...announcement,
          id: undefined // Let PostgreSQL generate new IDs
        }
      });
    }

    // Import prayer times
    for (const prayerTime of data.prayerTimes) {
      await prisma.prayerTime.create({
        data: {
          ...prayerTime,
          id: undefined
        }
      });
    }

    // Import events
    for (const event of data.events) {
      await prisma.event.create({
        data: {
          ...event,
          id: undefined
        }
      });
    }

    console.log('Data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
