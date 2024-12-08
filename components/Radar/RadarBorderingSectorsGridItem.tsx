'use client';
import React, {useEffect, useState} from 'react';
import {CircularProgress, Grid2, Typography} from "@mui/material";
import {BorderingSector, fetchBorderingSectors, RadarSectorWithRadar} from "@/actions/borderingSectors";
import {socket} from "@/lib/socket";
import {Radar} from "@prisma/client";
import {toast} from "react-toastify";
import {User} from "next-auth";

interface SectorWithBordering {
    primarySector: RadarSectorWithRadar;
    borderingSectors: BorderingSector[];
}

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
    }, [radar, user]);

    const onlineSectorsOpen = borderingSectors?.filter((sector) => sector.status === "open");
    const onlineSectorsConsolidated = borderingSectors?.filter((sector) => sector.status === "consolidated").map((sector) => sector.consolidatedTo);

    const openSectors = [...(onlineSectorsOpen?.map((sector) => sector.sector) || []), ...(onlineSectorsConsolidated || [])].filter((sector, index, self) =>
            index === self.findIndex((t) => (
                t?.id === sector?.id
            ))
    );

    const sectorsBordering: SectorWithBordering[] = [];

    for (const sector of openSectors) {
        if (!sector) continue;
        const bordering = borderingSectors?.filter((borderingSector) => borderingSector.consolidatedTo?.id === sector?.id) || [];
        sectorsBordering.push({primarySector: sector, borderingSectors: bordering});
    }

    return (
        <Grid2 size={4} height={250} sx={{border: 1, overflowY: 'auto' }}>
            <Typography variant="h6">BORDERING SECTORS</Typography>
            <Grid2 container columns={3}>
                <Grid2 size={2}>
                    <Grid2 container columns={2}>
                    {borderingSectors && borderingSectors.length === 0 &&
                    <Typography>You have no bordering sectors. Please define a radar consolidation to tell the system
                        what sectors you own and are logged on as.  If you have already done this, then make sure the current I.D.S you are on matches the facility that your primary sector is in. (Ex. PCT (OJAAY) must be in the PCT I.D.S)</Typography>}
                {sectorsBordering.map((sectorWithBordering) => (
                    <Grid2 key={sectorWithBordering.primarySector.id} size={1} sx={{border: 1,}}>
                        <Typography
                            variant="h6"
                            color="gold">{sectorWithBordering.primarySector.radarId !== radar.id ? `${sectorWithBordering.primarySector.radar.identifier} - ${sectorWithBordering.primarySector.identifier}` : sectorWithBordering.primarySector.identifier}</Typography>
                        <Typography variant="subtitle1" color="lightgreen" gutterBottom>OPEN
                            - {sectorWithBordering.primarySector.frequency}</Typography>
                        {sectorWithBordering.borderingSectors.map((sector) => (
                            <Typography key={sector.sector.id}
                                        variant="subtitle2">{`${sector.sector.radarId !== radar.id ? `${sector.sector.radar.facilityId} - ` : ''} ${sector.sector.identifier}`}</Typography>
                        ))}
                        </Grid2>
                    ))}
                    </Grid2>
                </Grid2>
                {!borderingSectors && <CircularProgress/>}
                {borderingSectors && borderingSectors.length > 0 && <Grid2 size={1} sx={{border: 1,}}>
                    <Typography variant="h6" color="red">CLOSED</Typography>
                    {borderingSectors?.filter((sector) => sector.status === "closed").map((sector) => (
                        <Typography key={sector.sector.id}
                                    variant="subtitle2">{`${sector.sector.radarId !== radar.id ? `${sector.sector.radar.facilityId} - ` : ''} ${sector.sector.identifier}`}</Typography>
                    ))}
                </Grid2>}
            </Grid2>
        </Grid2>
    );
}
