'use client';
import React from 'react';
import {Button} from "@mui/material";
import {signIn, signOut} from "next-auth/react";
import {Session} from "next-auth";

function LoginButton({session}: { session: Session | null }) {
    if (session) {
        return (
            <Button variant="contained" color="inherit" onClick={() => signOut({
                callbackUrl: '/',
            })}>
                Logout
            </Button>
        )
    } else {
        return (
            <Button variant="contained" color="inherit" onClick={() => signIn('vatsim', {
                callbackUrl: '/',
            })}>
                Login with VATSIM
            </Button>
        );
    }
}

export default LoginButton;