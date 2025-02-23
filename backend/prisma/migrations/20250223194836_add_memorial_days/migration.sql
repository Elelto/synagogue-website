-- CreateTable
CREATE TABLE "MemorialDay" (
    "id" SERIAL NOT NULL,
    "hebrewDate" TEXT NOT NULL,
    "gregorianDate" TIMESTAMP(3) NOT NULL,
    "purchasedBy" TEXT NOT NULL,
    "dedicatedTo" TEXT NOT NULL,
    "message" TEXT,
    "paymentId" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemorialDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemorialDay_paymentId_key" ON "MemorialDay"("paymentId");
