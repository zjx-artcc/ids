-- DropForeignKey
ALTER TABLE "Airport" DROP CONSTRAINT "Airport_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "AirportRunway" DROP CONSTRAINT "AirportRunway_airportId_fkey";

-- DropForeignKey
ALTER TABLE "RadarConsolidation" DROP CONSTRAINT "RadarConsolidation_primarySectorId_fkey";

-- DropForeignKey
ALTER TABLE "RadarSector" DROP CONSTRAINT "RadarSector_radarId_fkey";

-- AddForeignKey
ALTER TABLE "Airport"
    ADD CONSTRAINT "Airport_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirportRunway"
    ADD CONSTRAINT "AirportRunway_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadarSector"
    ADD CONSTRAINT "RadarSector_radarId_fkey" FOREIGN KEY ("radarId") REFERENCES "Radar" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadarConsolidation"
    ADD CONSTRAINT "RadarConsolidation_primarySectorId_fkey" FOREIGN KEY ("primarySectorId") REFERENCES "RadarSector" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
