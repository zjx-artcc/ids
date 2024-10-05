'use client';
import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Divider, Grid2, Stack, Tooltip, Typography} from "@mui/material";
import {AtisUpdate} from "@/types";
import {fetchMetar} from "@/actions/atis";
import {socket} from "@/lib/socket";
import {getMetarColor} from "@/lib/metar";

export default function AirportAtisGridItems({icao, small}: { icao: string, small?: boolean }) {

    const [combinedAtis, setCombinedAtis] = useState<AtisUpdate>();
    const [departureAtis, setDepartureAtis] = useState<AtisUpdate>();
    const [arrivalAtis, setArrivalAtis] = useState<AtisUpdate>();

    const [metar, setMetar] = useState<string>();

    useEffect(() => {
        socket.on('vatsim-data', (data) => {
            fetchMetar(icao).then(setMetar);
            (data.atis as {
                atis_code: string,
                callsign: string,
                frequency: string,
                text_atis: string[],
            }[])
                .filter((atis) => atis.callsign.startsWith(icao))
                .map((atis) => {
                    let textAtisLetter = atis.atis_code;
                    if (atis?.text_atis && atis.text_atis.length > 0) {
                        textAtisLetter = atis.text_atis[0]?.match(/ATIS INFO ([A-Z])/i)?.[1] || '-';
                    }
                    const atisLetter = getMoreRecentAtisLetter(atis.atis_code, textAtisLetter);

                    const atisUpdate = {
                        atisLetter: atisLetter,
                        airportConditions: atis.text_atis?.join(' ') || 'N/A',
                        notams: 'N/A',
                    } as AtisUpdate;

                    if (atis.callsign.includes('_D_')) {
                        setDepartureAtis(atisUpdate);
                    } else if (atis.callsign.includes('_A_')) {
                        setArrivalAtis(atisUpdate);
                    } else {
                        setCombinedAtis(atisUpdate);
                    }
                });

        });

        return () => {
            socket.off('vatsim-data');
        };
    }, [icao]);

    const {wind, altimeter} = getWindAndAltimeter(metar || '');

    if (small) {
        return (
            <>
                <Grid2 size={1} sx={{border: 1,}}>
                    <Typography variant="h6" textAlign="center">{icao.toUpperCase()}</Typography>
                </Grid2>
                <Grid2 size={1} sx={{border: 1,}}>
                    {!metar &&
                        <Stack direction="column" justifyContent="center" alignItems="center">
                            <CircularProgress size={25}/>
                        </Stack>
                    }
                    {metar && <Tooltip title={metar} arrow>
                        <Box>
                            {!combinedAtis && !departureAtis && !arrivalAtis &&
                                <Typography variant="h5" textAlign="center" color={getMetarColor(metar || '')}
                                            fontWeight="bold">-</Typography>}
                            {combinedAtis &&
                                <Typography variant="h5" textAlign="center" color={getMetarColor(metar || '')}
                                            fontWeight="bold">{combinedAtis.atisLetter}</Typography>}
                            {(departureAtis || arrivalAtis) && !combinedAtis && <Typography variant="h6"><span
                                style={{color: 'green'}}>{departureAtis?.atisLetter || '-'}</span>/<span
                                style={{color: 'red'}}>{arrivalAtis?.atisLetter || '-'}</span></Typography>}
                        </Box>
                    </Tooltip>}
                </Grid2>
                <Grid2 size={2} sx={{border: 1,}}>
                    <Typography textAlign="center" variant="h6">{wind}</Typography>
                </Grid2>
                <Grid2 size={1} sx={{border: 1,}}>
                    <Typography textAlign="center" variant="h6"
                                sx={{
                                    textDecoration: 'underline',
                                    textDecorationColor: 'orange',
                                }}>{altimeter}</Typography>
                </Grid2>
            </>
        )
    }

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
                {!combinedAtis && !departureAtis && !arrivalAtis &&
                    <Typography variant="subtitle2">ATIS NOT AVAILABLE.</Typography>}
                {combinedAtis && <Typography
                    variant="subtitle2">{combinedAtis.airportConditions} NOTAMS {combinedAtis.notams}</Typography>}
                {!combinedAtis && departureAtis && <Typography variant="subtitle2"
                    color="green">{departureAtis.airportConditions} NOTAMS {departureAtis.notams}</Typography>}
                {!combinedAtis && arrivalAtis &&
                    <Typography variant="subtitle2"
                                color="red">{arrivalAtis.airportConditions} NOTAMS {arrivalAtis.notams}</Typography>}
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

const getMoreRecentAtisLetter = (atisCode: string, textAtisLetter: string): string => {
    if (!atisCode) return textAtisLetter;
    if (!textAtisLetter) return atisCode;

    const atisCodeIndex = atisCode.charCodeAt(0);
    const textAtisLetterIndex = textAtisLetter.charCodeAt(0);

    if (textAtisLetterIndex > atisCodeIndex || (atisCodeIndex === 90 && textAtisLetterIndex === 65)) {
        return textAtisLetter;
    }

    return atisCode;
};