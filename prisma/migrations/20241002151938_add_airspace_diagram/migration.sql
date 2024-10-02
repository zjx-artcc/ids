-- CreateTable
CREATE TABLE "AirspaceDiagram"
(
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "url"       TEXT NOT NULL,
    "airportId" TEXT,
    "sectorId"  TEXT,

    CONSTRAINT "AirspaceDiagram_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AirspaceDiagram"
    ADD CONSTRAINT "AirspaceDiagram_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirspaceDiagram"
    ADD CONSTRAINT "AirspaceDiagram_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "RadarSector" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
