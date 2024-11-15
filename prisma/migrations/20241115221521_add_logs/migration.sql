/*
  Warnings:

  - You are about to drop the column `date` on the `Log` table. All the data in the column will be lost.
  - Added the required column `model` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "LogModel" AS ENUM ('AIRPORT', 'AIRPORT_RUNWAY', 'FLOW_PRESET', 'FLOW_PRESET_RUNWAY', 'RADAR', 'RADAR_SECTOR', 'RADAR_CONSOLIDATION', 'DEFAULT_RADAR_CONSOLIDATION', 'AIRSPACE_DIAGRAM', 'TMU_NOTICE', 'IMPORT', 'EXPORT', 'FRONTEND_ARP_SET', 'FRONTEND_RDR_SET', 'FRONTEND_RDR_CONSOL');

-- AlterTable
ALTER TABLE "Log"
    DROP COLUMN "date",
    ADD COLUMN "model"     "LogModel"   NOT NULL,
    ADD COLUMN "timestamp" TIMESTAMP(3) NOT NULL,
    ADD COLUMN "type"      "LogType"    NOT NULL,
    ADD COLUMN "userId"    TEXT         NOT NULL;

-- AddForeignKey
ALTER TABLE "Log"
    ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
