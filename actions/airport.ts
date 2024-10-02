'use server';

import {z} from "zod";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {GridFilterItem, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import {Prisma} from "@prisma/client";

export const fetchAirports = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {
    const orderBy: Prisma.AirportOrderByWithRelationInput = {};
    if (sort.length > 0) {
        const sortField = sort[0].field as keyof Prisma.AirportOrderByWithRelationInput;
        orderBy[sortField] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.airport.count({
            where: getWhere(filter),
        }),
        prisma.airport.findMany({
            orderBy,
            where: getWhere(filter),
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
            include: {
                radars: {
                    orderBy: {
                        identifier: 'asc',
                    }
                },
                runways: {
                    orderBy: {
                        runwayIdentifier: 'asc',
                    },
                },
            },
        })
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.AirportWhereInput => {
    if (!filter) {
        return {};
    }
    switch (filter?.field) {
        case 'icao':
            return {
                icao: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                },
            };
        case 'iata':
            return {
                iata: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                },
            };
        default:
            return {};
    }
};

export const createOrUpdateAirport = async (formData: FormData) => {
    const airportZ = z.object({
        id: z.string().optional(),
        icao: z.string().toUpperCase().length(4, "ICAO is required and must be 4 characters long."),
        iata: z.string().toUpperCase().length(3, "IATA is required and must be 3 characters long."),
        sopLink: z.string().url("SOP Link is required and must be a valid URL."),
        runways: z.array(z.object({
            id: z.string().optional(),
            runwayIdentifier: z.string().min(1, "Runway Identifier is required"),
            availableDepartureTypes: z.array(z.string().min(1, "Available Departure Types are required")),
            availableApproachTypes: z.array(z.string().min(1, "Available Approach Types are required")),
        })).min(1, "At least one runway is required"),
        radars: z.array(z.string()),
    });

    const result = airportZ.safeParse({
        id: formData.get("id") as string,
        icao: formData.get("icao") as string,
        iata: formData.get("iata") as string,
        sopLink: formData.get("sopLink") as string,
        runways: JSON.parse(formData.get("runways") as string),
        radars: JSON.parse(formData.get("radars") as string),
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    await prisma.airportRunway.deleteMany({
        where: {
            airportId: result.data.id || '',
        },
    });

    const airport = await prisma.airport.upsert({
        create: {
            icao: result.data.icao,
            iata: result.data.iata,
            sopLink: result.data.sopLink,
            facility: {
                connectOrCreate: {
                    where: {id: result.data.iata},
                    create: {
                        id: result.data.iata,
                    }
                },
            },
            runways: {
                create: result.data.runways.map((runway) => ({
                    runwayIdentifier: runway.runwayIdentifier,
                    availableDepartureTypes: {set: runway.availableDepartureTypes},
                    availableApproachTypes: {set: runway.availableApproachTypes},
                })),
            },
            radars: {
                connect: result.data.radars.map((radarId) => ({id: radarId})),
            },
        },
        update: {
            icao: result.data.icao,
            iata: result.data.iata,
            runways: {
                create: result.data.runways.map((runway) => ({
                    runwayIdentifier: runway.runwayIdentifier,
                    availableDepartureTypes: runway.availableDepartureTypes,
                    availableApproachTypes: runway.availableApproachTypes,
                })),
            },
            radars: {
                set: result.data.radars.map((radarId) => ({id: radarId})),
            },
        },
        where: {
            id: result.data.id || '',
        },
    });

    revalidatePath("/admin/airports");

    return {airport};
}