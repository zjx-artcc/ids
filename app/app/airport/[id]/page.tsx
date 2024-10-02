import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Grid2} from "@mui/material";
import AirportAtisGridItems from "@/components/Airport/AirportAtisGridItems";
import AirportFlowGridItem from "@/components/Airport/AirportFlowGridItem";
import AirportLocalInformation from "@/components/Airport/AirportLocalInformation";
import AirportNotamInformation from "@/components/Airport/AirportNotamInformation";
import TmuGridItem from "@/components/Tmu/TmuGridItem";
import AirportRadarInformation from "@/components/Airport/AirportRadarInformation";
import AirportChartsGridItem from "@/components/Airport/AirportChartsGridItem";
import AirportButtonsTray from "@/components/Airport/AirportButtonsTray";
import Viewer from "@/components/Viewer/Viewer";

export default async function Page({params}: { params: { id: string } }) {

    const airport = await prisma.airport.findUnique({
        where: {
            facilityId: params.id,
        },
        include: {
            facility: true,
            runways: true,
            radars: true,
            presets: true,
        }
    });

    if (!airport) {
        notFound();
    }

    return (
        <Grid2 container columns={12}>
            <AirportAtisGridItems icao={airport.icao}/>
            <AirportFlowGridItem airport={airport} runways={airport.runways}/>
            <AirportLocalInformation airport={airport}
                                     prefixes={airport.radars.map((radar) => radar.atcPrefixes).flat()}/>
            <AirportNotamInformation airport={airport}/>
            <TmuGridItem facility={airport.facility}/>
            <AirportRadarInformation radars={airport.radars}/>
            <AirportChartsGridItem airport={airport}/>
            <AirportButtonsTray airport={airport}/>
            <Viewer/>
        </Grid2>
    );
}