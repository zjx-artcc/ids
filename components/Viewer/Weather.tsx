'use client';
import React from 'react';
import {Stack, Typography} from "@mui/material";
import Image from "next/image";

export default function Weather() {
    return (
        <>
            <Typography textAlign="center" variant="subtitle2">Page might need to be refreshed for up to date data.
                Check the footer of each feed to confirm that it is current.</Typography>
            <Stack direction="row" flexWrap="wrap" justifyContent="center">
                <Image style={{padding: '1rem',}} src="https://radar.weather.gov/ridge/standard/NORTHEAST_loop.gif"
                       alt="Radar" width={600} height={600} unoptimized/>
                <Image style={{padding: '1rem',}} src="https://radar.weather.gov/ridge/standard/SOUTHEAST_loop.gif"
                       alt="Radar" width={600} height={600} unoptimized/>
                <Image style={{padding: '1rem',}} src="https://radar.weather.gov/ridge/standard/CONUS_loop.gif"
                       alt="Radar" width={900} height={600} unoptimized/>
            </Stack>
        </>

    );
}