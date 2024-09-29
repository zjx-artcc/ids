import React from 'react';
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import RadarTable from "@/components/Admin/Radar/RadarTable";
import Link from "next/link";
import {Add} from "@mui/icons-material";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="h5">Radar Facilities</Typography>
                    <Link href="/admin/radars/new">
                        <Button variant="contained" startIcon={<Add/>}>New Radar Facility</Button>
                    </Link>
                </Stack>
                <RadarTable/>
            </CardContent>
        </Card>
    );
}