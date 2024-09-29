import React from 'react';
import prisma from "@/lib/db";
import {Typography} from "@mui/material";
import AirportForm from "@/components/Admin/Airport/AirportForm";
import {notFound} from "next/navigation";

export default async function Page({params}: { params: { icao: string } }) {

    const {icao} = params;

    const airport = await prisma.airport.findUnique({
        where: {
            icao,
        },
        include: {
            radars: true,
            runways: true,
        },
    });

    if (!airport) {
        notFound();
    }

    const allRadars = await prisma.radar.findMany({
        orderBy: {
            identifier: 'asc',
        },
    });

    return (
        <>
            <Typography variant="h5" gutterBottom>Edit Airport {airport.icao}</Typography>
            <AirportForm airport={airport} currentRadars={airport.radars} currentRunways={airport.runways}
                         allRadars={allRadars}/>
        </>
    );
}