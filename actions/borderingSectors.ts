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