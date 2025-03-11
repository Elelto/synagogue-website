-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PrayerTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PrayerTime" ("createdAt", "dayOfWeek", "id", "isHoliday", "name", "time", "updatedAt") SELECT "createdAt", "dayOfWeek", "id", "isHoliday", "name", "time", "updatedAt" FROM "PrayerTime";
DROP TABLE "PrayerTime";
ALTER TABLE "new_PrayerTime" RENAME TO "PrayerTime";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
