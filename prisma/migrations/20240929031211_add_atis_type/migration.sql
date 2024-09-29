/*
  Warnings:

  - Added the required column `atisType` to the `FlowPreset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FlowPresetAtisType" AS ENUM ('COMBINED', 'DEPARTURE', 'ARRIVAL');

-- AlterTable
ALTER TABLE "FlowPreset"
    ADD COLUMN "atisType" "FlowPresetAtisType" NOT NULL;
