import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {AtisUpdate} from "@/types";
import {Prisma} from "@prisma/client";
import {revalidatePath} from "next/cache";
import AirportRunwayUpdateInput = Prisma.AirportRunwayUpdateInput;

export async function POST(req: NextRequest) {
    const atisUpdate: AtisUpdate = await req.json();
    const {facility, atisType} = atisUpdate;

    // Fetch the flow preset for the given ICAO
    const flowPreset = await prisma.flowPreset.findFirst({
        where: {
            airport: {
                icao: facility,
            },
            presetName: atisUpdate.preset,
        },
        include: {
            runways: {
                include: {
                    runway: true,
                },
            },
            airport: true,
        }
    });

    if (!flowPreset) {
        return NextResponse.json(false);
    }

    const newRunways = [];

    for (const runway of flowPreset?.runways) {
        const updateData: AirportRunwayUpdateInput = {};

        if (atisType === "combined" || atisType === "departure") {
            updateData.inUseDepartureTypes = runway.departureTypes;
        }

        if (atisType === "combined" || atisType === "arrival") {
            updateData.inUseApproachTypes = runway.approachTypes;
        }

        await prisma.airportRunway.update({
            where: {
                id: runway.runway.id,
            },
            data: {
                inUseDepartureTypes: {
                    set: [],
                },
                inUseApproachTypes: {
                    set: [],
                },
            },
        });

        const r = await prisma.airportRunway.update({
            where: {
                id: runway.runway.id,
            },
            data: updateData,
        });

        newRunways.push(r);
    }

    revalidatePath(',', "layout");

    return NextResponse.json({
        facilityId: flowPreset.airport.facilityId,
        runways: newRunways,
    });
}