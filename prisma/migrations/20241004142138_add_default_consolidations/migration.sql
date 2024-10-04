-- AlterTable
ALTER TABLE "RadarSector"
    ADD COLUMN "defaultRadarConsolidationId" TEXT;

-- CreateTable
CREATE TABLE "DefaultRadarConsolidation"
(
    "id"              TEXT NOT NULL,
    "primarySectorId" TEXT NOT NULL,

    CONSTRAINT "DefaultRadarConsolidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_defaultSecondarySectors"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_defaultSecondarySectors_AB_unique" ON "_defaultSecondarySectors" ("A", "B");

-- CreateIndex
CREATE INDEX "_defaultSecondarySectors_B_index" ON "_defaultSecondarySectors" ("B");

-- AddForeignKey
ALTER TABLE "DefaultRadarConsolidation"
    ADD CONSTRAINT "DefaultRadarConsolidation_primarySectorId_fkey" FOREIGN KEY ("primarySectorId") REFERENCES "RadarSector" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_defaultSecondarySectors"
    ADD CONSTRAINT "_defaultSecondarySectors_A_fkey" FOREIGN KEY ("A") REFERENCES "DefaultRadarConsolidation" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_defaultSecondarySectors"
    ADD CONSTRAINT "_defaultSecondarySectors_B_fkey" FOREIGN KEY ("B") REFERENCES "RadarSector" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
