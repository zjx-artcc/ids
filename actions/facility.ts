'use server';
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";

export const deleteFacility = async (id: string) => {

    console.log(id);

    await prisma.facility.delete({
        where: {
            id,
        },
    });

    revalidatePath('/', "layout");
}