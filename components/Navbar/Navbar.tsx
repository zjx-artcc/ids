import React from 'react';
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import Logo from "@/components/Navbar/Logo";
import ZuluClock from "@/components/Navbar/ZuluClock";
import LoginButton from "@/components/Navbar/LoginButton";
import {Session} from "next-auth";
import Link from "next/link";
import getConfig from 'next/config';

const {IS_STAFF_ENDPOINT, DEV_MODE} = process.env;

export default async function Navbar({session}: { session: Session | null, }) {
    if(!IS_STAFF_ENDPOINT) {
        return <Typography>Staff endpoint undefined.</Typography>
    }

    const res = await fetch(IS_STAFF_ENDPOINT.replace('{cid}', session?.user.cid || ''));

    const isStaff: boolean = await res.json();
    const {publicRuntimeConfig} = getConfig();

    return (
        <AppBar position="sticky" style={{backgroundColor: "#002D2F"}}>
            <Toolbar>
                <Logo/>
                {session ? <ZuluClock/> : ''}
                <Box sx={{ml: 4, p: 0.5, border: 1, borderColor: 'cyan',}}>
                    <Typography variant="subtitle1" color="cyan"
                                fontWeight="bold">{session?.user.fullName || 'NO SESSION'}</Typography>
                    {DEV_MODE === 'true' &&
                        <Typography variant="subtitle2" color="limegreen">Development Build</Typography>}
                    {DEV_MODE !== 'true' &&
                        <Typography variant="subtitle2">IDS & ERIDS v{publicRuntimeConfig?.version}</Typography>}
                </Box>
                <span style={{flexGrow: 1,}}></span>
                {session && isStaff && <Link href="/admin" style={{color: 'inherit',}}>
                    <Button variant="contained" color="inherit" sx={{mr: 1,}}>ADMIN</Button>
                </Link>}
                <LoginButton session={session}/>
            </Toolbar>
        </AppBar>
    );
}