/*
  Warnings:

  - You are about to drop the column `beneficiaries` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `modules` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `courses` table. All the data in the column will be lost.
  - Added the required column `category` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topics` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."courses" DROP CONSTRAINT "courses_createdBy_fkey";

-- Add temporary nullable columns
ALTER TABLE "courses" ADD COLUMN "category_temp" TEXT,
ADD COLUMN "name_temp" TEXT,
ADD COLUMN "price_temp" TEXT,
ADD COLUMN "topics_temp" INTEGER,
ADD COLUMN "materials_temp" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update temporary columns with data from existing columns
UPDATE "courses" SET 
name_temp = title,
category_temp = COALESCE(SPLIT_PART(title, ' - ', 1), 'General'),
topics_temp = COALESCE(array_length(modules, 1), 5),
price_temp = CASE 
  WHEN color = 'from-green-500 to-green-600' THEN '$19'
  ELSE '$29'
END,
materials_temp = modules,
description = COALESCE(description, 'Course description to be added');

-- Drop old columns
ALTER TABLE "courses" 
DROP COLUMN "beneficiaries",
DROP COLUMN "color",
DROP COLUMN "createdBy",
DROP COLUMN "endDate",
DROP COLUMN "endTime",
DROP COLUMN "modules",
DROP COLUMN "startDate",
DROP COLUMN "startTime",
DROP COLUMN "status",
DROP COLUMN "title";

-- Add new required columns with data from temp columns
ALTER TABLE "courses"
ADD COLUMN "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN "price" TEXT NOT NULL DEFAULT '',
ADD COLUMN "topics" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "materials" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Copy data from temp columns
UPDATE "courses" SET
category = COALESCE(category_temp, 'General'),
name = COALESCE(name_temp, 'Untitled Course'),
price = COALESCE(price_temp, '$19'),
topics = COALESCE(topics_temp, 5),
materials = COALESCE(materials_temp, ARRAY[]::TEXT[]);

-- Drop default values
ALTER TABLE "courses" 
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "price" DROP DEFAULT,
ALTER COLUMN "topics" DROP DEFAULT;

-- Drop temporary columns
ALTER TABLE "courses"
DROP COLUMN category_temp,
DROP COLUMN name_temp,
DROP COLUMN price_temp,
DROP COLUMN topics_temp,
DROP COLUMN materials_temp;

-- Set description as non-nullable
ALTER TABLE "courses" ALTER COLUMN "description" SET NOT NULL;
