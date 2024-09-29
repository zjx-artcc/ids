import React from 'react';
import prisma from "@/lib/db";
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {notFound} from "next/navigation";
import RadarSectorTable from "@/components/Admin/RadarSector/RadarSectorTable";
import Link from "next/link";
import {Add} from "@mui/icons-material";

export default async function Page({params}: { params: { id: string } }) {

    const {id} = params;

    const radar = await prisma.radar.findUnique({
        where: {
            id,
        },
        include: {
            sectors: {
                include: {
                    borderingSectors: true,
                },
            },
        },
    });

    if (!radar) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="h5">{radar.name} - Radar Sectors</Typography>
                    <Link href={`/admin/radars/${radar.id}/sectors/new`}>
                        <Button variant="contained" startIcon={<Add/>}>New Radar Sector</Button>
                    </Link>
                </Stack>
                <RadarSectorTable radar={radar}/>
            </CardContent>
        </Card>
    );
}