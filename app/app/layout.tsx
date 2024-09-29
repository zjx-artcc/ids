import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Typography} from "@mui/material";

export default async function Layout({children}: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return <Typography>Only members of the ARTCC can access the IDS. Login to continue.</Typography>
    }

    return (
        <>
            {children}
        </>
    );
}