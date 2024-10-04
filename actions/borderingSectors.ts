'use server';

import {Radar, RadarSector} from "@prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";

export type RadarSectorWithRadar = RadarSector & {
    radar: Radar;
}

export type BorderingSector = {
    sector: RadarSectorWithRadar;
    status: 'open' | 'consolidated' | 'closed',
    consolidatedTo?: RadarSectorWithRadar;
}

export const fetchBorderingSectors = async (): Promise<BorderingSector[]> => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return [];
    }

    const radarConsolidation = await prisma.radarConsolidation.findFirst({
        where: {
            userId: session.user.id,
        },
        include: {
            primarySector: {
                include: {
                    radar: true,
                },
            },
            secondarySectors: {
                include: {
                    radar: true,
                },
            },
        },
    });

    if (!radarConsolidation) {
        return [];
    }

    const primarySectorId = radarConsolidation.primarySector.id;
    const secondarySectorIds = radarConsolidation.secondarySectors.map(sector => sector.id);

    // Fetch bordering sectors
    const borderingSectors = await prisma.radarSector.findMany({
        where: {
            OR: [
                {borderingSectors: {some: {id: primarySectorId}}},
                {borderingSectors: {some: {id: {in: secondarySectorIds}}}},
            ],
        },
        include: {
            radar: true,
        },
    });

    // Remove duplicates
    const uniqueBorderingSectors = Array.from(new Set(borderingSectors.map(sector => sector.id)))
        .map(id => borderingSectors.find(sector => sector.id === id))
        .filter((sector): sector is RadarSectorWithRadar => sector !== undefined); // Type guard to ensure sector is defined

    // Check status of bordering sectors
    return await Promise.all(uniqueBorderingSectors.map(async (sector) => {
        const primaryConsolidation = await prisma.radarConsolidation.findFirst({
            where: {primarySectorId: sector.id},
        });

        if (primaryConsolidation) {
            return {sector, status: 'open'};
        }

        const secondaryConsolidation = await prisma.radarConsolidation.findFirst({
            where: {secondarySectors: {some: {id: sector.id}}},
            include: {
                primarySector: {
                    include: {
                        radar: true,
                    },
                }
            },
        });

        if (secondaryConsolidation) {
            return {sector, status: 'consolidated', consolidatedTo: secondaryConsolidation.primarySector};
        }

        return {sector, status: 'closed'};
    }));
}