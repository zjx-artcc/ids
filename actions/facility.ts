'use server';
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";

export const fetchAllFacilities = async () => {
    return prisma.facility.findMany();
}

export const getSopLink = async (id: string) => {
    const facility = await prisma.facility.findUnique({
        where: {
            id,
        },
        include: {
            airport: true,
            radar: true,
        },
    });

    return facility?.airport?.sopLink || facility?.radar?.sopLink;
}

export const deleteFacility = async (id: string) => {

    const f = await prisma.facility.delete({
        where: {
            id,
        },
        include: {
            airport: true,
            radar: true,
        },
    });

    if (f.airport) {
        await log("DELETE", "AIRPORT", `Deleted airport ${f.airport.icao}`);
    } else if (f.radar) {
        await log("DELETE", "RADAR", `Deleted radar ${f.radar.name}`);
    }

    revalidatePath('/', "layout");
}