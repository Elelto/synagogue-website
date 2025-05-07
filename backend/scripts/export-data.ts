import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exportData() {
  try {
    const announcements = await prisma.announcement.findMany();
    const prayerTimes = await prisma.prayerTime.findMany();
    const events = await prisma.event.findMany();

    const data = {
      announcements,
      prayerTimes,
      events
    };

    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
