import prisma from "@/lib/db";
import {log} from "@/actions/log";

export async function GET() {

    const airports = await prisma.airport.findMany();

    const radars = await prisma.radar.findMany({
        include: {
            connectedAirports: {
                select: {
                    id: true,
                },
            },
        },
    });

    const runways = await prisma.airportRunway.findMany();

    const radarSectors = await prisma.radarSector.findMany({
        include: {
            borderingSectors: {
                select: {
                    id: true,
                },
            },
        },
    });

    const flowPresets = await prisma.flowPreset.findMany();

    const flowPresetRunways = await prisma.flowPresetRunway.findMany();

    const defaultRadarConsolidations = await prisma.defaultRadarConsolidation.findMany({
        include: {
            secondarySectors: {
                select: {
                    id: true,
                },
            },
        },
    });

    const airspaceDiagrams = await prisma.airspaceDiagram.findMany();

    await log("UPDATE", "EXPORT", "Config file exported successfully");
    
    return Response.json({
        airports,
        radars,
        runways,
        radarSectors,
        flowPresets,
        flowPresetRunways,
        defaultRadarConsolidations,
        airspaceDiagrams,
    });

}