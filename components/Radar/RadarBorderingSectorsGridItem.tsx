'use client';
import React, {useEffect, useState} from 'react';
import {CircularProgress, Grid2, Typography} from "@mui/material";
import {BorderingSector, fetchBorderingSectors} from "@/actions/borderingSectors";
import {socket} from "@/lib/socket";
import {Radar} from "@prisma/client";
import {toast} from "react-toastify";
import {User} from "next-auth";

export default function RadarBorderingSectorsGridItem({user, radar}: { user: User, radar: Radar, }) {

    const [borderingSectors, setBorderingSectors] = useState<BorderingSector[]>();

    useEffect(() => {
        fetchBorderingSectors(user, radar).then(setBorderingSectors);

        socket.on('radar-consolidation', () => {
            fetchBorderingSectors(user, radar).then(setBorderingSectors);
            toast.info('Radar consolidations have been updated.  This may or may not include your sectors or bordering sectors.');
        });

        return () => {
            socket.off('radar-consolidation');
        };
    }, []);

    return (
        <Grid2 size={4} height={250} sx={{border: 1,}}>
            <Typography variant="h6">BORDERING SECTORS</Typography>
            <Grid2 container columns={3}>
                {!borderingSectors && <CircularProgress/>}
                {borderingSectors && borderingSectors.length === 0 &&
                    <Typography>You have no bordering sectors. Please define a radar consolidation to tell the system
                        what sectors you own and are logged on as.  If you have already done this, then make sure the current I.D.S you are on matches the facility that your primary sector is in. (Ex. PCT (OJAAY) must be in the PCT I.D.S)</Typography>}
                {borderingSectors?.map((sector) => (
                    <Grid2 key={sector.sector.id} size={1} sx={{border: 1,}}>
                        <Typography
                            variant="h6" color="gold">{sector.sector.radarId !== radar.id ? `${sector.sector.radar.identifier} - ${sector.sector.identifier}` : sector.sector.identifier}</Typography>
                        {sector.status === "open" && <Typography variant="subtitle2" color="lightgreen">OPEN
                            - {sector.sector.frequency}</Typography>}
                        {sector.status === "consolidated" && <Typography variant="subtitle2" color="lightgray">{sector.consolidatedTo?.radarId !== radar.id ? `${sector.consolidatedTo?.radar.identifier} - ${sector.consolidatedTo?.identifier}` : sector.consolidatedTo?.identifier} @ {sector.consolidatedTo?.frequency}</Typography>}
                        {sector.status === "closed" && <Typography variant="subtitle2" color="red">CLOSED</Typography>}
                    </Grid2>
                ))}
            </Grid2>
        </Grid2>
    );
}
