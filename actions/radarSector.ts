'use server';
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {GridFilterItem, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import {Prisma, Radar} from "@prisma/client";
import {z} from "zod";

export const fetchAllRadarSectors = async () => {
    return prisma.radarSector.findMany({
        include: {
            radar: true,
        },
    });
}

export const fetchRadarSectors = async (radar: Radar, pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {
    const orderBy: Prisma.RadarSectorOrderByWithRelationInput = {};
    if (sort.length > 0) {
        const sortField = sort[0].field as keyof Prisma.RadarSectorOrderByWithRelationInput;
        orderBy[sortField] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.radarSector.count({
            where: {
                radarId: radar.id,
                ...getWhere(filter),
            },
        }),
        prisma.radarSector.findMany({
            where: {
                radarId: radar.id,
                ...getWhere(filter),
            },
            orderBy,
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
            include: {
                borderingSectors: {
                    include: {
                        radar: true,
                    },
                },
            },
        }),
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.RadarSectorWhereInput => {
    if (!filter) {
        return {};
    }

    switch (filter.field) {
        case 'identifier':
            return {
                identifier: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                },
            };
        case 'frequency':
            return {
                frequency: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                },
            };
        case 'borderingSectors':
            return {
                OR: [
                    {
                        borderingSectors: {
                            some: {
                                identifier: {
                                    [filter.operator]: filter.value as string,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                    {
                        borderingSectors: {
                            some: {
                                radar: {
                                    identifier: {
                                        [filter.operator]: filter.value as string,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    },
                ],
            };
        default:
            return {};
    }
}

export const createOrUpdateRadarSector = async (formData: FormData) => {
    const radarSectorZ = z.object({
        id: z.string().optional(),
        radarId: z.string(),
        identifier: z.string().min(1, "Identifier is required"),
        frequency: z.string().min(1, "Frequency is required"),
        borderingSectors: z.array(z.string()),
    });

    const result = radarSectorZ.safeParse({
        id: formData.get('id') as string,
        radarId: formData.get('radarId') as string,
        identifier: formData.get('identifier') as string,
        frequency: formData.get('frequency') as string,
        borderingSectors: JSON.parse(formData.get('borderingSectors') as string),
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const radarSector = await prisma.radarSector.upsert({
        create: {
            identifier: result.data.identifier,
            frequency: result.data.frequency,
            radarId: result.data.radarId,
            borderingSectors: {
                connect: result.data.borderingSectors.map((id) => ({id})),
            },
        },
        update: {
            identifier: result.data.identifier,
            frequency: result.data.frequency,
            borderingSectors: {
                set: result.data.borderingSectors.map((id) => ({id})),
            },
        },
        where: {
            id: result.data.id || '',
        },
        include: {
            radar: true,
        },
    });

    revalidatePath(`/admin/radars/${radarSector.radar.id}/sectors`);
    return {radarSector};
}

export const deleteRadarSector = async (id: string) => {
    const radarSector = await prisma.radarSector.delete({
        where: {
            id,
        },
        include: {
            radar: true,
        },
    });

    revalidatePath(`/admin/radars/${radarSector.radar.id}/sectors`);
}