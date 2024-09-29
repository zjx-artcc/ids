/*
  Warnings:

  - You are about to drop the column `isStaff` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isStaff";

-- CreateTable
CREATE TABLE "TmuNotice"
(
    "id"      TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "TmuNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility"
(
    "id"      TEXT NOT NULL,
    "radarId" TEXT NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport"
(
    "id"         TEXT NOT NULL,
    "icao"       TEXT NOT NULL,
    "iata"       TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "localSplit" TEXT[],
    "notams"     TEXT[],
    "sopLink"    TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirportRunway"
(
    "id"                      TEXT NOT NULL,
    "runwayIndentifier"       TEXT NOT NULL,
    "availableDepartureTypes" TEXT[],
    "availableApproachTypes"  TEXT[],
    "inUseDepartureTypes"     TEXT[],
    "inUseApproachTypes"      TEXT[],
    "airportId"               TEXT NOT NULL,

    CONSTRAINT "AirportRunway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Radar"
(
    "id"                TEXT    NOT NULL,
    "identifier"        TEXT    NOT NULL,
    "name"              TEXT    NOT NULL,
    "facilityId"        TEXT    NOT NULL,
    "atcPrefixes"       TEXT[],
    "radarSplit"        TEXT[],
    "notams"            TEXT[],
    "isEnrouteFacility" BOOLEAN NOT NULL,
    "sopLink"           TEXT    NOT NULL,

    CONSTRAINT "Radar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadarSector"
(
    "id"         TEXT    NOT NULL,
    "identifier" TEXT    NOT NULL,
    "frequency"  TEXT    NOT NULL,
    "open"       BOOLEAN NOT NULL DEFAULT false,
    "radarId"    TEXT    NOT NULL,

    CONSTRAINT "RadarSector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadarConsolidation"
(
    "id"              TEXT NOT NULL,
    "radarId"         TEXT NOT NULL,
    "primarySectorId" TEXT NOT NULL,

    CONSTRAINT "RadarConsolidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacilityToTmuNotice"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AirportToRadar"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_borderingSectors"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_secondarySectors"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Airport_icao_key" ON "Airport" ("icao");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iata_key" ON "Airport" ("iata");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_facilityId_key" ON "Airport" ("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "Radar_identifier_key" ON "Radar" ("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Radar_facilityId_key" ON "Radar" ("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "RadarConsolidation_primarySectorId_key" ON "RadarConsolidation" ("primarySectorId");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilityToTmuNotice_AB_unique" ON "_FacilityToTmuNotice" ("A", "B");

-- CreateIndex
CREATE INDEX "_FacilityToTmuNotice_B_index" ON "_FacilityToTmuNotice" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AirportToRadar_AB_unique" ON "_AirportToRadar" ("A", "B");

-- CreateIndex
CREATE INDEX "_AirportToRadar_B_index" ON "_AirportToRadar" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_borderingSectors_AB_unique" ON "_borderingSectors" ("A", "B");

-- CreateIndex
CREATE INDEX "_borderingSectors_B_index" ON "_borderingSectors" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_secondarySectors_AB_unique" ON "_secondarySectors" ("A", "B");

-- CreateIndex
CREATE INDEX "_secondarySectors_B_index" ON "_secondarySectors" ("B");

-- AddForeignKey
ALTER TABLE "Airport"
    ADD CONSTRAINT "Airport_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirportRunway"
    ADD CONSTRAINT "AirportRunway_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Radar"
    ADD CONSTRAINT "Radar_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadarSector"
    ADD CONSTRAINT "RadarSector_radarId_fkey" FOREIGN KEY ("radarId") REFERENCES "Radar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadarConsolidation"
    ADD CONSTRAINT "RadarConsolidation_radarId_fkey" FOREIGN KEY ("radarId") REFERENCES "Radar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadarConsolidation"
    ADD CONSTRAINT "RadarConsolidation_primarySectorId_fkey" FOREIGN KEY ("primarySectorId") REFERENCES "RadarSector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToTmuNotice"
    ADD CONSTRAINT "_FacilityToTmuNotice_A_fkey" FOREIGN KEY ("A") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToTmuNotice"
    ADD CONSTRAINT "_FacilityToTmuNotice_B_fkey" FOREIGN KEY ("B") REFERENCES "TmuNotice" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AirportToRadar"
    ADD CONSTRAINT "_AirportToRadar_A_fkey" FOREIGN KEY ("A") REFERENCES "Airport" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AirportToRadar"
    ADD CONSTRAINT "_AirportToRadar_B_fkey" FOREIGN KEY ("B") REFERENCES "Radar" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_borderingSectors"
    ADD CONSTRAINT "_borderingSectors_A_fkey" FOREIGN KEY ("A") REFERENCES "RadarSector" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_borderingSectors"
    ADD CONSTRAINT "_borderingSectors_B_fkey" FOREIGN KEY ("B") REFERENCES "RadarSector" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondarySectors"
    ADD CONSTRAINT "_secondarySectors_A_fkey" FOREIGN KEY ("A") REFERENCES "RadarConsolidation" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondarySectors"
    ADD CONSTRAINT "_secondarySectors_B_fkey" FOREIGN KEY ("B") REFERENCES "RadarSector" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
