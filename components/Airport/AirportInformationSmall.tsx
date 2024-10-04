'use client';
import React from 'react';
import {Airport, AirportRunway} from "@prisma/client";
import {Grid2} from "@mui/material";
import AirportAtisGridItems from "@/components/Airport/AirportAtisGridItems";
import AirportFlowGridItem from "@/components/Airport/AirportFlowGridItem";
import AirportLocalInformation from "@/components/Airport/AirportLocalInformation";

export default function AirportInformationSmall({airport, runways}: { airport: Airport, runways: AirportRunway[], }) {
    return (
        <Grid2 container columns={10}>
            <AirportAtisGridItems icao={airport.icao} small/>
            <AirportFlowGridItem airport={airport} runways={runways} small/>
            <AirportLocalInformation airport={airport} small/>
        </Grid2>
    );
}