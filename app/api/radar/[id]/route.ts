import prisma from "@/lib/db";

export async function GET(req: never, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;

    const radar = await prisma.radar.findUnique({
        where: {
            id,
        },
        include: {
            sectors: true,
        },
    });

    return Response.json(radar);
}