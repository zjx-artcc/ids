import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import TmuTable from "@/components/Admin/TMU/TmuTable";
import Link from "next/link";
import {Add} from "@mui/icons-material";

export default async function Page() {

    return (
        <>
            <Stack direction="row" spacing={1} justifyContent="space-between">
                <Typography variant="h5">T.M.U Notices</Typography>
                <Link href="/admin/tmu/new">
                    <Button variant="contained" startIcon={<Add/>}>Broadcast</Button>
                </Link>
            </Stack>
            <TmuTable/>
        </>
    );

}