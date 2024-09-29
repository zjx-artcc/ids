'use server';

import {GridFilterItem, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import {FlowPresetAtisType, Prisma} from "@prisma/client";
import prisma from "@/lib/db";
import {z} from "zod";
import {revalidatePath} from "next/cache";

export const fetchFlowPresets = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {
    const orderBy: Prisma.FlowPresetOrderByWithRelationInput = {};
    if (sort.length > 0) {
        const sortField = sort[0].field as keyof Prisma.FlowPresetOrderByWithRelationInput;
        orderBy[sortField] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.flowPreset.count({
            where: getWhere(filter),
        }),
        prisma.flowPreset.findMany({
            orderBy,
            where: getWhere(filter),
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
            include: {
                airport: true,
            },
        })
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.FlowPresetWhereInput => {
    if (!filter) {
        return {};
    }
    switch (filter?.field) {
        case 'presetName':
            return {
                presetName: {
                    contains: filter.value as string,
                    mode: 'insensitive',
                },
            };
        case 'atisType':
            return {
                atisType: filter.value as FlowPresetAtisType,
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
        default:
            return {};
    }
}

export const createOrUpdateFlowPreset = async (formData: FormData) => {
    const flowPresetZ = z.object({
        id: z.string().optional(),
        presetName: z.string().min(1, "Preset name is required"),
        atisType: z.string().min(1, "ATIS type is required")
            .refine((value) => Object.values(FlowPresetAtisType).includes(value as FlowPresetAtisType), {
                message: "Invalid ATIS type",
            }),
        icao: z.string().min(1, "Airport is required"),
        runways: z.array(z.object({
            runwayId: z.string(),
            departureTypes: z.array(z.string()),
            approachTypes: z.array(z.string()),
        })).min(1, "At least one runway is required"),
    });

    const result = flowPresetZ.safeParse({
        id: formData.get('id') as string,
        presetName: formData.get('presetName') as string,
        atisType: formData.get('atisType') as string,
        icao: formData.get('icao') as string,
        runways: JSON.parse(formData.get('runways') as string),
        airportId: formData.get('airportId') as string,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    if (result.data.id) {
        await prisma.flowPresetRunway.deleteMany({
            where: {
                flowPresetId: result.data.id,
            },
        });
    }

    const flowPreset = await prisma.flowPreset.upsert({
        create: {
            presetName: result.data.presetName,
            atisType: result.data.atisType as FlowPresetAtisType,
            airport: {
                connect: {
                    icao: result.data.icao,
                },
            },
            runways: {
                create: result.data.runways.map((runway) => ({
                    runwayId: runway.runwayId,
                    departureTypes: {
                        set: runway.departureTypes,
                    },
                    approachTypes: {
                        set: runway.approachTypes,
                    },
                })),
            },
        },
        update: {
            presetName: result.data.presetName,
            atisType: result.data.atisType as FlowPresetAtisType,
            runways: {
                create: result.data.runways.map((runway) => ({
                    runwayId: runway.runwayId,
                    departureTypes: {
                        set: runway.departureTypes,
                    },
                    approachTypes: {
                        set: runway.approachTypes,
                    },
                })),
            },
        },
        where: {
            id: result.data.id || '',
        },
    });

    revalidatePath('/', "layout");

    return {flowPreset};
}

export const deleteFlowPreset = async (id: string) => {
    await prisma.flowPreset.delete({
        where: {
            id,
        },
    });

    revalidatePath('/', "layout");
}