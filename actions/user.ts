'use server';

import prisma from "@/lib/db";

export const fetchAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            cid: true,
        }
    });
}
