'use client';
import React, {useEffect, useState} from 'react';
import {Facility, TmuNotice} from "@prisma/client";
import {Box, Grid2, Typography} from "@mui/material";
import {fetchSingleTmu} from "@/actions/tmu";
import {socket} from "@/lib/socket";

export default function TmuGridItem({facility}: { facility: Facility, }) {

    const [broadcasts, setBroadcasts] = useState<TmuNotice[]>();

    useEffect(() => {
        fetchSingleTmu(facility).then(setBroadcasts);
        socket.on(`${facility.id}-tmu`, () => {
            fetchSingleTmu(facility).then(setBroadcasts);
        });
    }, [facility]);

    return (
        <Grid2 size={3} sx={{border: 1,}}>
            <Typography variant="h6">TMU</Typography>
            <Box height={250} sx={{overflow: 'auto',}}>
                {broadcasts?.map((broadcast) => (
                    <Typography key={broadcast.id} color="orange" fontWeight="bold">{broadcast.message}</Typography>
                ))}
            </Box>
        </Grid2>
    );

}