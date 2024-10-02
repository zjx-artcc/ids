'use client';
import React, {useEffect, useState} from 'react';
import {CircularProgress, Divider, Grid2, Stack, Typography} from "@mui/material";
import {AtisUpdate} from "@/types";
import {fetchMetar} from "@/actions/atis";
import {socket} from "@/lib/socket";
import {getMetarColor} from "@/lib/metar";

export default function AirportAtisGridItems({icao}: { icao: string, }) {

    const [combinedAtis, setCombinedAtis] = useState<AtisUpdate>();
    const [departureAtis, setDepartureAtis] = useState<AtisUpdate>();
    const [arrivalAtis, setArrivalAtis] = useState<AtisUpdate>();

    const [metar, setMetar] = useState<string>();

    useEffect(() => {
        socket.on('vatsim-data', (data) => {
            fetchMetar(icao).then(setMetar);
            (data.atis as {
                atisCode: string,
                callsign: string,
                frequency: string,
                textAtis: string[],
            }[])
                .filter((atis) => atis.callsign.startsWith(icao))
                .map((atis) => {
                    if (atis.callsign.includes('_D_')) {
                        setDepartureAtis({
                            atisLetter: atis.atisCode,
                            airportConditions: atis.textAtis.join(' '),
                            notams: 'N/A',
                        } as AtisUpdate);
                    } else if (atis.callsign.includes('_A_')) {
                        setArrivalAtis({
                            atisLetter: atis.atisCode,
                            airportConditions: atis.textAtis.join(' '),
                            notams: 'N/A',
                        } as AtisUpdate);
                    } else {
                        setCombinedAtis({
                            atisLetter: atis.atisCode,
                            airportConditions: atis.textAtis.join(' '),
                            notams: 'N/A',
                        } as AtisUpdate);
                    }
                });

        });

    }, [icao]);

    const {wind, altimeter} = getWindAndAltimeter(metar || '');

    return (
        <>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h3" textAlign="center">{icao.toUpperCase()}</Typography>
                {!metar &&
                    <Stack direction="column" alignItems="center">
                        <CircularProgress size={80}/>
                        <Typography variant="subtitle2" textAlign="center">Loading may take up to 15
                            seconds</Typography>
                    </Stack>
                }
            </Grid2>
            <Grid2 size={1} sx={{border: 6, borderColor: getMetarColor(metar || ''),}}>
                {!combinedAtis && !departureAtis && !arrivalAtis &&
                    <Typography variant="h1" textAlign="center" color={getMetarColor(metar || '')}
                                fontWeight="bold">-</Typography>}
                {combinedAtis && <Typography variant="h1" textAlign="center" color={getMetarColor(metar || '')}
                                             fontWeight="bold">{combinedAtis.atisLetter}</Typography>}
                {departureAtis && <Typography variant="h3" textAlign="center" color="green"
                                              fontWeight="bold">{departureAtis.atisLetter}</Typography>}
                {arrivalAtis && <Typography variant="h3" textAlign="center" color="red"
                                            fontWeight="bold">{arrivalAtis.atisLetter}</Typography>}
                <Typography variant="h6" textAlign="center">{wind}</Typography>
                <Typography variant="h6" textAlign="center"
                            sx={{textDecoration: 'underline', textDecorationColor: 'orange',}}>{altimeter}</Typography>
            </Grid2>
            <Grid2 size={6} sx={{border: 1,}}>
                <Typography variant="h6" color={getMetarColor(metar || '')}>{metar}</Typography>
                <Divider/>
                {!combinedAtis && !departureAtis && !arrivalAtis && <Typography>ATIS NOT AVAILABLE.</Typography>}
                {combinedAtis && <Typography>{combinedAtis.airportConditions} NOTAMS {combinedAtis.notams}</Typography>}
                {!combinedAtis && departureAtis && <Typography
                    color="green">{departureAtis.airportConditions} NOTAMS {departureAtis.notams}</Typography>}
                {!combinedAtis && arrivalAtis &&
                    <Typography color="red">{arrivalAtis.airportConditions} NOTAMS {arrivalAtis.notams}</Typography>}
            </Grid2>
        </>
    );


}

export const getWindAndAltimeter = (metar: string) => {
    const wind = metar.match(/(\d{3}|VRB)\d{2}KT/);
    const altimeter = metar.match(/A\d{4}/);

    return {
        wind: wind ? wind[0] : '00000KT',
        altimeter: altimeter ? altimeter[0] : 'A0000',
    };
}