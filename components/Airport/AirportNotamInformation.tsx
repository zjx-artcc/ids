'use client';
import React, {useEffect, useState} from 'react';
import {Airport} from "@prisma/client";
import {Box, Grid2, Typography} from "@mui/material";
import {socket} from "@/lib/socket";

export default function AirportNotamInformation({airport}: { airport: Airport, }) {

    const [notams, setNotams] = useState<string[]>(airport.notams);

    useEffect(() => {
        socket.on(`${airport.icao}-notam`, (data: string[]) => {
            setNotams(data);
        });
    }, [airport]);

    return (
        <Grid2 size={5} sx={{border: 1,}}>
            <Typography variant="h6">NOTAM</Typography>
            <Box height={250} sx={{overflow: 'auto',}}>
                {airport.notams.map((notam, idx) => (
                    <Typography key={airport.icao + idx + 'NOTAM'} color="gray">{notam}</Typography>
                ))}
            </Box>
        </Grid2>
    );
}