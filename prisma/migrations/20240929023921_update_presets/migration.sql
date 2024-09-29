/*
  Warnings:

  - Added the required column `airportId` to the `FlowPreset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FlowPreset"
    ADD COLUMN "airportId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FlowPreset"
    ADD CONSTRAINT "FlowPreset_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
