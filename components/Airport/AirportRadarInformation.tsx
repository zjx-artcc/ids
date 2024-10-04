'use client';
import React, {useEffect, useState} from 'react';
import {Radar} from "@prisma/client";
import {socket} from "@/lib/socket";
import {Box, Grid2, Typography} from "@mui/material";
import {getColor} from "@/lib/facilityColor";
import {toast} from "react-toastify";

export default function AirportRadarInformation({radars}: { radars: Radar[], }) {

    const [onlineAtc, setOnlineAtc] = useState<{ position: string, frequency: string, facility: number, }[]>();
    const [radarSplit, setRadarSplit] = useState<{
        radar: Radar,
        data: string[],
    }[]>(radars.filter((r) => r.radarSplit.length > 0).map((r) => ({
        radar: r,
        data: r.radarSplit
    })).sort((a, b) => Number(a.radar.isEnrouteFacility) - Number(b.radar.isEnrouteFacility))
        .sort((a, b) => a.radar.facilityId.localeCompare(b.radar.facilityId)));

    useEffect(() => {
        socket.on('vatsim-data', (data) => {
            setOnlineAtc((data.controllers as {
                callsign: string,
                frequency: string,
                facility: number,
            }[])
                .filter((c) => radars.some((r) => r.atcPrefixes.some((prefix) => c.callsign.startsWith(prefix))))
                .filter((c) => c.facility > 4)
                .sort((a, b) => a.callsign.localeCompare(b.callsign))
                .sort((a, b) => a.facility - b.facility)
                .map((controller) => ({
                    position: controller.callsign,
                    frequency: controller.frequency,
                    facility: controller.facility,
                })));
        });
        radars.forEach((r) => {
            socket.on(`${r.facilityId}-radar-split`, (data: string[]) => {
                setRadarSplit((prev) => prev.filter((rs) => rs.radar.facilityId !== r.facilityId));
                setRadarSplit((prev) => [...prev, {radar: r, data,}]);
                setRadarSplit((prev) => prev
                    .sort((a, b) => Number(a.radar.isEnrouteFacility) - Number(b.radar.isEnrouteFacility))
                    .sort((a, b) => a.radar.facilityId.localeCompare(b.radar.facilityId))
                );
                toast.info(`${r.facilityId} radar split has been updated.`);
            });
        });
    }, [radars]);

    return (
        <>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h6">RADAR ONLINE</Typography>
                <Box height={250} sx={{overflow: 'auto',}}>
                    {onlineAtc?.map((atc) => (
                        <Typography key={atc.position} color={getColor(atc.facility)}>
                            <b>{atc.position}</b> {'--->'} {atc.frequency}
                        </Typography>
                    ))}
                </Box>
            </Grid2>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h6">RADAR SPLIT</Typography>
                <Box height={250} sx={{overflow: 'auto',}}>
                    {radarSplit.map((rs) => (
                        <Box key={rs.radar.id} sx={{mb: 1,}}>
                            <Typography color="hotpink" fontWeight="bold">{rs.radar.facilityId}</Typography>
                            {rs.data.map((s, idx) => (
                                <Typography key={rs.radar.facilityId + idx + 'RADARSPLIT'}>{s}</Typography>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Grid2>
        </>

    );
}