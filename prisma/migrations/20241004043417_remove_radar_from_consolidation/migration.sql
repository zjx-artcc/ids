/*
  Warnings:

  - You are about to drop the column `radarId` on the `RadarConsolidation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RadarConsolidation"
    DROP CONSTRAINT "RadarConsolidation_radarId_fkey";

-- AlterTable
ALTER TABLE "RadarConsolidation"
    DROP COLUMN "radarId";
