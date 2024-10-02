'use client';
import React, {useEffect, useState} from 'react';
import {Airport, AirportRunway} from "@prisma/client";
import {Divider, Grid2, Stack, Typography} from "@mui/material";
import {socket} from "@/lib/socket";

export default function AirportFlowGridItem({airport, runways}: { airport: Airport, runways: AirportRunway[], }) {

    const [departureRunways, setDepartureRunways] = useState<AirportRunway[]>(runways.filter(runway => runway.inUseDepartureTypes.length > 0));
    const [arrivalRunways, setArrivalRunways] = useState<AirportRunway[]>(runways.filter(runway => runway.inUseApproachTypes.length > 0));

    useEffect(() => {
        socket.on(`${airport.facilityId}-flow`, (data: AirportRunway[]) => {
            setDepartureRunways(data.filter(runway => runway.inUseDepartureTypes.length > 0));
            setArrivalRunways(data.filter(runway => runway.inUseApproachTypes.length > 0));
        });
    }, [airport]);

    return (
        <Grid2 size={3} sx={{border: 1,}}>
            <Stack direction="column" spacing={1} sx={{color: 'yellow'}}>
                {arrivalRunways.map(runway => (
                    <Typography key={runway.id} variant="h4">
                        {runway.inUseApproachTypes.join('/')} <b>{runway.runwayIdentifier}</b>
                    </Typography>
                ))}
                <Divider/>
                {departureRunways.map(runway => (
                    <Typography key={runway.id} variant="h4" color="purple">
                        DEPS {runway.inUseDepartureTypes.join('/')} <b>{runway.runwayIdentifier}</b>
                    </Typography>
                ))}
            </Stack>
        </Grid2>
    );
}