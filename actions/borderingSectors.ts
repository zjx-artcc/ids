'use server';
import {Radar, RadarSector} from "@prisma/client";
import {User} from "next-auth";
import prisma from "@/lib/db";

export type RadarSectorWithRadar = RadarSector & {
    radar: Radar;
}

export type BorderingSector = {
    sector: RadarSectorWithRadar;
    status: 'open' | 'consolidated' | 'closed',
    consolidatedTo?: RadarSectorWithRadar;
}

export const fetchBorderingSectors = async (user: User, thisRadar: Radar): Promise<BorderingSector[]> => {

    const radarConsolidation = await prisma.radarConsolidation.findFirst({
        where: {
            userId: user.id,
        },
        include: {
            primarySector: {
                include: {
                    radar: true,
                    borderingSectors: {
                        include: {
                            radar: true,
                        },
                    },
                },
            },
            secondarySectors: {
                include: {
                    radar: true,
                    borderingSectors: {
                        include: {
                            radar: true,
                        },
                    },
                },
            },
        },
    });

    if (!radarConsolidation) {
        return [];
    }

    // check if user is working this radar as a primary sector
    if (radarConsolidation.primarySector.radarId !== thisRadar.id) {
        return [];
    }

    const borderingPrimary = radarConsolidation.primarySector.borderingSectors;
    const borderingSecondary = radarConsolidation.secondarySectors.flatMap((sector) => sector.borderingSectors);

    const allBorderingSectors = Array.from(new Set([...borderingPrimary, ...borderingSecondary].map(sector => sector.id)))
        .map(id => [...borderingPrimary, ...borderingSecondary].find(sector => sector.id === id))
        .filter((sector): sector is RadarSectorWithRadar => sector !== undefined)
        .filter(sector => sector.id !== radarConsolidation.primarySector.id && !radarConsolidation.secondarySectors.map(s => s.id).includes(sector.id));


    const borderingSectors: BorderingSector[] = [];

    for (const sector of allBorderingSectors) {
        const primaryConsolidation = await prisma.radarConsolidation.findFirst({
            where: {
                primarySectorId: sector.id,
            },
        });

        const secondaryConsolidation = await prisma.radarConsolidation.findFirst({
            where: {
                secondarySectors: {
                    some: {
                        id: sector.id,
                    },
                },
            },
            include: {
                primarySector: {
                    include: {
                        radar: true,
                    },
                },
            },
        });

        if (primaryConsolidation) {
            borderingSectors.push({
                sector,
                status: 'open',
            });
        } else if (secondaryConsolidation) {
            borderingSectors.push({
                sector,
                status: 'consolidated',
                consolidatedTo: secondaryConsolidation.primarySector,
            });
        } else {
            borderingSectors.push({
                sector,
                status: 'closed',
            });
        }
    }

    return borderingSectors;
}