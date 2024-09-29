import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";
import Link from "next/link";
import AirportTable from "@/components/Admin/Airport/AirportTable";

export default async function Page() {
    return (
        <>
            <Stack direction="row" spacing={1} justifyContent="space-between">
                <Typography variant="h5">Airports</Typography>
                <Link href="/admin/airports/new">
                    <Button variant="contained" startIcon={<Add/>}>New Airport</Button>
                </Link>
            </Stack>
            <AirportTable/>
        </>
    );

}