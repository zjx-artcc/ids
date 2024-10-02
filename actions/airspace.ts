'use server';

import prisma from "@/lib/db";
import {GridFilterItem, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import {Prisma} from "@prisma/client";
import {z} from "zod";
import {UTApi} from "uploadthing/server";
import {revalidatePath} from "next/cache";

const MAX_FILE_SIZE = 1024 * 1024 * 4;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ut = new UTApi();

export const getAirspaceDiagramUrl = async (key: string) => {
    return (await ut.getFileUrls([key])).data[0].url;
}

export const fetchAllAirspaceDiagrams = async () => {
    return prisma.airspaceDiagram.findMany({
        include: {
            airport: true,
            sector: {
                include: {
                    radar: true,
                },
            },
        },
    });
}

export const fetchAirspaceDiagrams = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {
    const orderBy: Prisma.AirspaceDiagramOrderByWithRelationInput = {};
    if (sort.length > 0) {
        const sortField = sort[0].field as keyof Prisma.AirspaceDiagramOrderByWithRelationInput;
        orderBy[sortField] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.airspaceDiagram.count({
            where: getWhere(filter),
        }),
        prisma.airspaceDiagram.findMany({
            orderBy,
            where: getWhere(filter),
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
            include: {
                sector: {
                    include: {
                        radar: true,
                    },
                },
                airport: true,
            },
        })
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.AirspaceDiagramWhereInput => {
    if (!filter) {
        return {};
    }
    switch (filter?.field) {
        case 'name':
            return {
                name: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                },
            };
        case 'airport':
            return {
                airport: {
                    icao: {
                        [filter.operator]: filter.value as string,
                        mode: 'insensitive',
                    },
                },
            };
        case 'radarSector':
            return {
                sector: {
                    radar: {
                        facilityId: {
                            [filter.operator]: filter.value as string,
                            mode: 'insensitive',
                        },
                    },
                },
            };
        default:
            return {};
    }
}

export const createOrUpdateAirspaceDiagram = async (formData: FormData) => {
    const airspaceDiagramZ = z.object({
        id: z.string().optional(),
        name: z.string(),
        airportId: z.string().optional(),
        sectorId: z.string().optional(),
        image: z
            .any()
            .optional()
            .or(
                z.any().refine((file) => {
                    return formData.get('id') || !file || file.size <= MAX_FILE_SIZE;
                }, 'File size must be less than 4MB')
                    .refine((file) => {
                        return formData.get('id') || ALLOWED_FILE_TYPES.includes(file?.type || '');
                    }, 'File must be a PNG, JPEG, or GIF')
            ),
    });

    const result = airspaceDiagramZ.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        airportId: formData.get('airportId'),
        sectorId: formData.get('sectorId'),
        image: formData.get('image') as File,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const existingDiagram = await prisma.airspaceDiagram.findUnique({
        where: {
            id: result.data.id,
        },
    });

    if (!existingDiagram && !result.data.image) {
        return {errors: [{message: 'An image is required for new airspace diagrams.',}]};
    }

    let imageKey = existingDiagram?.key;

    if ((result.data.image as File).size > 0) {
        const image = result.data.image as File;
        const res = await ut.uploadFiles(image);
        if (!res.data) {
            return {errors: [{message: 'Failed to upload image.',}]};
        }
        if (imageKey) {
            await ut.deleteFiles(imageKey);
        }
        imageKey = res.data?.key;
    }

    if (!imageKey) {
        return {errors: [{message: 'Failed to upload image.',}]};
    }

    const data = {
        name: result.data.name,
        airportId: result.data.airportId || undefined,
        sectorId: result.data.sectorId || undefined,
        key: imageKey,
    };

    const airspaceDiagram = await prisma.airspaceDiagram.upsert({
        where: {
            id: result.data.id,
        },
        update: data,
        create: data,
    });

    return {airspaceDiagram};
}

export const deleteAirspaceDiagram = async (id: string) => {
    const airspaceDiagram = await prisma.airspaceDiagram.delete({
        where: {
            id,
        },
    });

    await ut.deleteFiles(airspaceDiagram.key);

    revalidatePath('/admin/airspaces');
}