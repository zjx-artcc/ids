'use server';

import {GridFilterItem, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import {Facility, Prisma} from "@prisma/client";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {z} from "zod";

export const fetchSingleTmu = async (facility: Facility) => {
    return prisma.tmuNotice.findMany({
        where: {
            broadcastedFacilities: {
                some: {
                    id: facility.id,
                },
            },
        },
    });
}

export const fetchTmu = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {
    const orderBy: Prisma.TmuNoticeOrderByWithRelationInput = {};
    if (sort.length > 0) {
        const sortField = sort[0].field as keyof Prisma.TmuNoticeOrderByWithRelationInput;
        orderBy[sortField] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.tmuNotice.count({
            where: getWhere(filter),
        }),
        prisma.tmuNotice.findMany({
            orderBy,
            where: getWhere(filter),
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
            include: {
                broadcastedFacilities: {
                    orderBy: {
                        id: 'asc',
                    },
                },
            },
        })
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.TmuNoticeWhereInput => {
    if (!filter) {
        return {};
    }
    switch (filter?.field) {
        case 'facilities':
            return {
                broadcastedFacilities: {
                    some: {
                        id: {
                            [filter.operator]: filter.value as string,
                            mode: 'insensitive',
                        },
                    },
                },
            };
        case 'message':
            return {
                message: {
                    contains: filter.value as string,
                    mode: 'insensitive',
                },
            };
        default:
            return {};
    }
};

export const createOrUpdateTmu = async (formData: FormData) => {
    const tmuZ = z.object({
        id: z.string().optional(),
        message: z.string().min(1, "Message is required"),
        facilities: z.array(z.string()).min(1, "At least one facility must be selected"),
    });

    const result = tmuZ.safeParse({
        id: formData.get('id') as string,
        message: formData.get('message') as string,
        facilities: JSON.parse(formData.get('facilities') as string),
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const tmu = await prisma.tmuNotice.upsert({
        create: {
            message: result.data.message,
            broadcastedFacilities: {
                connect: result.data.facilities.map((id: string) => ({id})),
            },
        },
        update: {
            message: result.data.message,
            broadcastedFacilities: {
                set: result.data.facilities.map((id: string) => ({id})),
            },
        },
        where: {
            id: result.data.id || '',
        },
        include: {
            broadcastedFacilities: true,
        },
    });

    revalidatePath('/', "layout");
    return {tmu};
}

export const deleteTmu = async (id: string) => {
    await prisma.tmuNotice.delete({
        where: {id},
    });

    revalidatePath('/', "layout");
}