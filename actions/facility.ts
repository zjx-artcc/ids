'use server';
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";

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

    console.log(id);

    await prisma.facility.delete({
        where: {
            id,
        },
    });

    revalidatePath('/', "layout");
}