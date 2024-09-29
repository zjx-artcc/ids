-- DropForeignKey
ALTER TABLE "Radar" DROP CONSTRAINT "Radar_facilityId_fkey";

-- AddForeignKey
ALTER TABLE "Radar"
    ADD CONSTRAINT "Radar_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
