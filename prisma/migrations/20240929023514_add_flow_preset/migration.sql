-- CreateTable
CREATE TABLE "FlowPreset"
(
    "id"         TEXT NOT NULL,
    "presetName" TEXT NOT NULL,

    CONSTRAINT "FlowPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowPresetRunway"
(
    "id"             TEXT NOT NULL,
    "flowPresetId"   TEXT NOT NULL,
    "runwayId"       TEXT NOT NULL,
    "departureTypes" TEXT[],
    "approachTypes"  TEXT[],

    CONSTRAINT "FlowPresetRunway_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlowPresetRunway"
    ADD CONSTRAINT "FlowPresetRunway_flowPresetId_fkey" FOREIGN KEY ("flowPresetId") REFERENCES "FlowPreset" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowPresetRunway"
    ADD CONSTRAINT "FlowPresetRunway_runwayId_fkey" FOREIGN KEY ("runwayId") REFERENCES "AirportRunway" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
