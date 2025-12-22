/*
  Warnings:

  - You are about to drop the column `timeLimit` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the `notice_batches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."notice_batches" DROP CONSTRAINT "notice_batches_batchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."notice_batches" DROP CONSTRAINT "notice_batches_noticeId_fkey";

-- AlterTable
ALTER TABLE "notices" DROP COLUMN "timeLimit",
ADD COLUMN     "recipientAdmins" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recipientTrainees" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recipientTrainers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validUntil" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."notice_batches";

-- CreateIndex
CREATE INDEX "notices_validUntil_idx" ON "notices"("validUntil");
