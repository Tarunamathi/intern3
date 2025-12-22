-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "daysOfWeek" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "startTime" TEXT;
