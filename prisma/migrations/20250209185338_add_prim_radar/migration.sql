/*
  Warnings:

  - You are about to drop the `_AirportToRadar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AirportToRadar"
    DROP CONSTRAINT "_AirportToRadar_A_fkey";

-- DropForeignKey
ALTER TABLE "_AirportToRadar"
    DROP CONSTRAINT "_AirportToRadar_B_fkey";

-- AlterTable
ALTER TABLE "Airport"
    ADD COLUMN "primaryRadarId" TEXT;

-- DropTable
DROP TABLE "_AirportToRadar";

-- CreateTable
CREATE TABLE "_allRadars"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_allRadars_AB_unique" ON "_allRadars" ("A", "B");

-- CreateIndex
CREATE INDEX "_allRadars_B_index" ON "_allRadars" ("B");

-- AddForeignKey
ALTER TABLE "Airport"
    ADD CONSTRAINT "Airport_primaryRadarId_fkey" FOREIGN KEY ("primaryRadarId") REFERENCES "Radar" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allRadars"
    ADD CONSTRAINT "_allRadars_A_fkey" FOREIGN KEY ("A") REFERENCES "Airport" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allRadars"
    ADD CONSTRAINT "_allRadars_B_fkey" FOREIGN KEY ("B") REFERENCES "Radar" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
