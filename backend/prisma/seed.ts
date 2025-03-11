import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Regular daily prayers
  const regularPrayers = [
    // Sunday to Friday
    { name: 'שחרית', time: '06:30', dayOfWeek: 0, isHoliday: false },
    { name: 'מנחה', time: '17:30', dayOfWeek: 0, isHoliday: false },
    { name: 'ערבית', time: '18:30', dayOfWeek: 0, isHoliday: false },
    
    { name: 'שחרית', time: '06:30', dayOfWeek: 1, isHoliday: false },
    { name: 'מנחה', time: '17:30', dayOfWeek: 1, isHoliday: false },
    { name: 'ערבית', time: '18:30', dayOfWeek: 1, isHoliday: false },
    
    { name: 'שחרית', time: '06:30', dayOfWeek: 2, isHoliday: false },
    { name: 'מנחה', time: '17:30', dayOfWeek: 2, isHoliday: false },
    { name: 'ערבית', time: '18:30', dayOfWeek: 2, isHoliday: false },
    
    { name: 'שחרית', time: '06:30', dayOfWeek: 3, isHoliday: false },
    { name: 'מנחה', time: '17:30', dayOfWeek: 3, isHoliday: false },
    { name: 'ערבית', time: '18:30', dayOfWeek: 3, isHoliday: false },
    
    { name: 'שחרית', time: '06:30', dayOfWeek: 4, isHoliday: false },
    { name: 'מנחה', time: '17:30', dayOfWeek: 4, isHoliday: false },
    { name: 'ערבית', time: '18:30', dayOfWeek: 4, isHoliday: false },
    
    // Friday (special times)
    { name: 'שחרית', time: '06:30', dayOfWeek: 5, isHoliday: false },
    { name: 'מנחה וקבלת שבת', time: '17:30', dayOfWeek: 5, isHoliday: false },
    
    // Saturday (Shabbat)
    { name: 'שחרית', time: '08:00', dayOfWeek: 6, isHoliday: false },
    { name: 'מנחה', time: '16:30', dayOfWeek: 6, isHoliday: false },
    { name: 'ערבית ומוצ"ש', time: '18:30', dayOfWeek: 6, isHoliday: false },
  ];

  // Holiday prayers
  const holidayPrayers = [
    { name: 'שחרית', time: '08:00', dayOfWeek: null, isHoliday: true },
    { name: 'מנחה', time: '17:30', dayOfWeek: null, isHoliday: true },
    { name: 'ערבית', time: '18:30', dayOfWeek: null, isHoliday: true },
  ];

  // Create regular prayers
  for (const prayer of regularPrayers) {
    await prisma.prayerTime.create({
      data: prayer
    });
  }

  // Create holiday prayers
  for (const prayer of holidayPrayers) {
    await prisma.prayerTime.create({
      data: prayer
    });
  }

  // Create a sample announcement
  await prisma.announcement.create({
    data: {
      title: 'ברוכים הבאים לבית הכנסת',
      content: 'ברוכים הבאים לאתר החדש של בית הכנסת. כאן תוכלו למצוא את כל המידע על זמני התפילות, אירועים ועדכונים שוטפים.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
