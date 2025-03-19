'use client';
import React from 'react';
import {Box, Button, ButtonGroup, Grid2, Typography} from "@mui/material";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Airport, Radar} from "@prisma/client";

export default function ButtonsTray({airport, radar,}: { airport?: Airport, radar?: Radar, }) {

    const pathname = usePathname();

    const redirectToViewer = (viewer: string, params?: URLSearchParams) => {
        return `${pathname}?${params?.toString() || ''}&viewer=${viewer}#viewer`;
    }

    return (
        <Grid2 size={2} sx={{border: 1,}}>
            <Typography variant="h6">VIEWER CTL</Typography>
            <Box height={250} sx={{overflow: 'auto',}}>
                <ButtonGroup size="small" variant="contained" disableElevation sx={{flexWrap: 'wrap', gap: 1,}}>
                    <Link href={redirectToViewer('wx')} style={{color: 'inherit',}}>
                        <Button color="inherit" style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:"0px"}}>WX</Button>
                    </Link>
                    <Link href={redirectToViewer('prd', new URLSearchParams({startAirport: airport?.iata || '',}))}>
                        <Button color="success">PRD</Button>
                    </Link>
                    <Link
                        href={redirectToViewer('sop', new URLSearchParams({facility: airport?.facilityId || radar?.facilityId || '',}))}>
                        <Button color="secondary">SOP</Button>
                    </Link>
                    {/*TODO: Change this to be an environment variable  */}
                    <Link
                        href={redirectToViewer('url', new URLSearchParams({url: 'https://dev.zjxartcc.org/documents'}))}>
                        <Button color="secondary">PUB</Button>
                    </Link>
                    <Link href={redirectToViewer('airspace')}>
                        <Button color="secondary">ASPC</Button>
                    </Link>
                    <Link href={redirectToViewer('set-airport')}>
                        <Button color="info">ARP/SET</Button>
                    </Link>
                    <Link href={redirectToViewer('set-radar')}>
                        <Button color="info">RDR/SET</Button>
                    </Link>
                    <Link href={redirectToViewer('consol')}>
                        <Button color="info">RDR/CONSOL</Button>
                    </Link>
                    <Link href={redirectToViewer('position')}>
                        <Button color="warning">POS</Button>
                    </Link>
                    <Link href={redirectToViewer('emergency')}>
                        <Button color="error">EMRG</Button>
                    </Link>
                    <Link href={pathname}>
                        <Button variant="contained" color="primary">CLR</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="contained" color="primary">EXIT</Button>
                    </Link>
                    {/*TODO: Change this to be an environment variable  */}
                    <Link href={redirectToViewer('url', new URLSearchParams({url: 'https://zjxartcc.org/'}))}
                          style={{color: 'inherit'}}>
                        <Button variant="outlined" color="inherit" size="small" style={{borderTopRightRadius:'0px',borderBottomRightRadius:"0px"}}>ZJX WEBSITE</Button>
                    </Link>
                    {/*TODO: Change this to be an environment variable  */}
                    <Link href={redirectToViewer('url', new URLSearchParams({url: 'https://asx.zjxartcc.org/'}))}
                          style={{color: 'inherit'}}>
                        <Button variant="outlined" color="inherit" size="small"
                                style={{borderTopRightRadius: '0px', borderBottomRightRadius: "0px"}}>ASX</Button>
                    </Link>
                </ButtonGroup>
                <Typography sx={{mt: 4,}}>&copy; 2024 vZJX</Typography>
                <Typography variant="subtitle2" color="red">NOT FOR REAL WORLD USE</Typography>
            </Box>
        </Grid2>
    );
}