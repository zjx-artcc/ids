import prisma from "@/lib/db";

export async function GET(req: never, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;

    const sector = await prisma.radarSector.findUnique({
        where: {
            id,
        }
    });

    return Response.json(sector);
}