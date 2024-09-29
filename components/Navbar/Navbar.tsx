import React from 'react';
import {AppBar, Button, Toolbar} from "@mui/material";
import Logo from "@/components/Navbar/Logo";
import ZuluClock from "@/components/Navbar/ZuluClock";
import LoginButton from "@/components/Navbar/LoginButton";
import {Session} from "next-auth";
import Link from "next/link";

export default async function Navbar({session}: { session: Session | null, }) {

    return (
        <AppBar position="sticky">
            <Toolbar>
                {session ? <ZuluClock/> : <Logo/>}
                <span style={{flexGrow: 1,}}></span>
                {session && <Link href="/admin">
                    <Button variant="contained" color="inherit" sx={{mr: 1,}}>ADMIN</Button>
                </Link>}
                <LoginButton session={session}/>
            </Toolbar>
        </AppBar>
    );
}