'use server';

import {
    Airport,
    AirportRunway,
    AirspaceDiagram,
    DefaultRadarConsolidation,
    FlowPreset,
    FlowPresetRunway,
    Radar,
    RadarSector
} from "@prisma/client";
import prisma from "@/lib/db";

type RadarWithConnectedAirports = Radar & { connectedAirports: { id: string, }[], };
type RadarSectorWithBorderingSectors = RadarSector & { borderingSectors: { id: string, }[], };
type DefaultRadarConsolidationWithSecondarySectors = DefaultRadarConsolidation & {
    secondarySectors: { id: string, }[],
};

export type ConfigFile = {
    airports: Airport[];
    radars: RadarWithConnectedAirports[];
    runways: AirportRunway[];
    radarSectors: RadarSectorWithBorderingSectors[];
    flowPresets: FlowPreset[];
    flowPresetRunways: FlowPresetRunway[];
    defaultRadarConsolidations: DefaultRadarConsolidationWithSecondarySectors[];
    airspaceDiagrams: AirspaceDiagram[];
}

export const importConfigFile = async (config: ConfigFile) => {

    await prisma.facility.deleteMany();
    await prisma.airport.deleteMany();
    await prisma.airportRunway.deleteMany();
    await prisma.radar.deleteMany();
    await prisma.radarSector.deleteMany();
    await prisma.flowPreset.deleteMany();
    await prisma.flowPresetRunway.deleteMany();
    await prisma.defaultRadarConsolidation.deleteMany();
    await prisma.airspaceDiagram.deleteMany();


    const facilities = [...config.airports, ...config.radars].map((f) => ({id: f.facilityId,}));

    await prisma.facility.createMany({
        data: facilities,
    });

    await prisma.airport.createMany({
        data: config.airports,
    });

    await prisma.airportRunway.createMany({
        data: config.runways,
    });

    await prisma.radar.createMany({
        data: config.radars.map(radar => ({
            ...radar,
            connectedAirports: undefined,
        })),
    });

    await prisma.radarSector.createMany({
        data: config.radarSectors.map(radarSector => ({
            ...radarSector,
            borderingSectors: undefined,
        })),
    });

    await prisma.flowPreset.createMany({
        data: config.flowPresets,
    });

    await prisma.flowPresetRunway.createMany({
        data: config.flowPresetRunways,
    });

    await prisma.defaultRadarConsolidation.createMany({
        data: config.defaultRadarConsolidations.map(consolidation => ({
            ...consolidation,
            secondarySectors: undefined,
        })),
    });

    await prisma.airspaceDiagram.createMany({
        data: config.airspaceDiagrams,
    });

    for (const radar of config.radars) {
        await prisma.radar.update({
            where: {
                id: radar.id,
            },
            data: {
                connectedAirports: {
                    connect: radar.connectedAirports,
                },
            },
        });
    }

    for (const consolidation of config.defaultRadarConsolidations) {
        await prisma.defaultRadarConsolidation.update({
            where: {
                id: consolidation.id,
            },
            data: {
                secondarySectors: {
                    connect: consolidation.secondarySectors,
                },
            },
        });
    }

    for (const radarSector of config.radarSectors) {
        await prisma.radarSector.update({
            where: {
                id: radarSector.id,
            },
            data: {
                borderingSectors: {
                    connect: radarSector.borderingSectors,
                },
            },
        });
    }
}