'use server';
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";

export const deleteFacility = async (id: string) => {
    await prisma.facility.delete({
        where: {
            id,
        },
    });

    revalidatePath('/', "layout");
}