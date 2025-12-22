/*
  Warnings:

  - You are about to drop the column `category` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `targetRole` on the `notices` table. All the data in the column will be lost.
  - The `attachments` column on the `notices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `description` to the `notices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notices" DROP COLUMN "category",
DROP COLUMN "content",
DROP COLUMN "expiresAt",
DROP COLUMN "isActive",
DROP COLUMN "targetRole",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "timeLimit" TIMESTAMP(3),
ALTER COLUMN "priority" SET DEFAULT 'medium',
DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB[] DEFAULT ARRAY[]::JSONB[];

-- CreateTable
CREATE TABLE "notice_batches" (
    "id" SERIAL NOT NULL,
    "noticeId" INTEGER NOT NULL,
    "batchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notice_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notice_batches_batchId_idx" ON "notice_batches"("batchId");

-- CreateIndex
CREATE INDEX "notice_batches_noticeId_idx" ON "notice_batches"("noticeId");

-- CreateIndex
CREATE UNIQUE INDEX "notice_batches_noticeId_batchId_key" ON "notice_batches"("noticeId", "batchId");

-- CreateIndex
CREATE INDEX "notices_createdAt_idx" ON "notices"("createdAt");

-- AddForeignKey
ALTER TABLE "notice_batches" ADD CONSTRAINT "notice_batches_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_batches" ADD CONSTRAINT "notice_batches_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
