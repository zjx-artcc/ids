'use client';
import React, {useEffect, useState} from 'react';
import {Box, Grid2, Typography} from "@mui/material";
import {getColor} from "@/lib/facilityColor";
import {Airport} from "@prisma/client";
import {socket} from "@/lib/socket";
import {useRouter} from "next/navigation";

export default function AirportLocalInformation({airport, prefixes}: { airport: Airport, prefixes: string[], }) {

    const [onlineAtc, setOnlineAtc] = useState<{ position: string, frequency: string, facility: number, }[]>();
    const [localSplit, setLocalSplit] = useState<string[]>(airport.localSplit);
    const router = useRouter();

    useEffect(() => {
        socket.on('vatsim-data', (data) => {
            setOnlineAtc((data.controllers as {
                callsign: string,
                frequency: string,
                facility: number,
            }[])
                .filter((c) => c.callsign.startsWith(airport.iata))
                .filter((c) => c.facility > 0)
                .sort((a, b) => a.callsign.localeCompare(b.callsign))
                .sort((a, b) => a.facility - b.facility)
                .map((controller) => ({
                    position: controller.callsign,
                    frequency: controller.frequency,
                    facility: controller.facility,
                })));
        });
        socket.on(`${airport.facilityId}-lcl-split`, (data: string[]) => {
            setLocalSplit(data);
        });
    }, [router, airport, prefixes]);

    return (
        <>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h6">LCL ONLINE</Typography>
                <Box height={250} sx={{overflow: 'auto',}}>
                    {onlineAtc?.map((atc) => (
                        <Typography key={atc.position} color={getColor(atc.facility)}>
                            <b>{atc.position}</b> {'--->'} {atc.frequency}
                        </Typography>
                    ))}
                </Box>
            </Grid2>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h6">LCL SPLIT</Typography>
                <Box height={250} sx={{overflow: 'auto',}}>
                    {localSplit.length > 0 &&
                        <Typography color="hotpink" fontWeight="bold">{airport.facilityId}</Typography>}
                    {localSplit.map((s, idx) => (
                        <Typography key={airport.icao + idx + 'LCLSPLIT'}>{s}</Typography>
                    ))}
                </Box>
            </Grid2>
        </>

    );
}