import React from 'react';
import {Button, ButtonGroup, Divider, Grid2, Stack, Typography} from "@mui/material";

export default async function Page({params}: { params: { icao: string } }) {

    return (
        <Grid2 container columns={12}>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h3" textAlign="center">{params.icao.toUpperCase()}</Typography>
                <Typography>ATIS - 134.850</Typography>
            </Grid2>
            <Grid2 size={1} sx={{border: 1,}}>
                <Typography variant="h1" textAlign="center" color="green" fontWeight="bold">Q</Typography>
                <Typography variant="h6" textAlign="center">120/03</Typography>
                <Typography variant="h6" textAlign="center"
                            sx={{textDecoration: 'underline', textDecorationColor: 'orange',}}>30.05</Typography>
            </Grid2>
            <Grid2 size={6} sx={{border: 1,}}>
                <Typography variant="h6">KIAD 242252Z 12003KT 10SM BKN010 OVC016 18/17 A3005 RMK AO2 SLP175
                    T01830172</Typography>
                <Divider/>
                <Typography>IAD ATIS INFO H 2252Z.
                    13003KT 10SM BKN010 OVC016 18/17
                    A3005 (THREE ZERO ZERO FIVE).
                    ILS APCH RWY 19L, RWY 19C, RWY
                    19R.
                    DEPG RWY 30.
                    NOTAMS...
                    RWY 19R APCH LGTS OTS, RWY 30
                    REILS OTS.
                    RWY 19L CC 3 3 3 AT 1015.
                    BIRD ACTIVITY VICINITY ARPT.
                    ...ADVS YOU HAVE INFO H.</Typography>
            </Grid2>
            <Grid2 size={3} sx={{border: 1,}}>
                <Stack direction="column" spacing={1} sx={{color: 'yellow'}}>
                    <Typography variant="h4">
                        ILS/VIS <b>01C</b>
                    </Typography>
                    <Typography variant="h4">
                        ILS <b>01R</b>
                    </Typography>
                    <Typography variant="h4">
                        RNP-Y/VIS <b>01L</b>
                    </Typography>
                    <Divider/>
                    <Typography variant="h4" color="purple">
                        DEPS <b>30 01C</b>
                    </Typography>
                </Stack>
            </Grid2>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h6">LCL ONLINE</Typography>

                <Typography color="pink"><b>IAD_N_TWR</b> {'--->'} 134.425</Typography>
                <Typography color="pink"><b>IAD_E_TWR</b> {'--->'} 120.100</Typography>
                <Typography color="lightgreen"><b>IAD_W_GND</b> {'--->'} 121.625</Typography>
                <Typography color="lightgreen"><b>IAD_E_GND</b> {'--->'} 121.900</Typography>
                <Typography color="lightgreen"><b>IAD_R_GND</b> {'--->'} 129.550</Typography>
                <Typography color="brown"><b>IAD_DEL</b> {'--->'} 135.700</Typography>
            </Grid2>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h6">LCL SPLIT</Typography>
                <Typography>2 WAY TOWER DECON - SPLIT AT RAMP</Typography>
                <Typography>GROUNDS MATCH TOWER</Typography>
                <Typography>RAMP OPEN</Typography>
            </Grid2>
            <Grid2 size={5} sx={{border: 1,}}>
                <Typography variant="h6">NOTAM</Typography>
                <Typography color="gray">IAD NAV ILS RWY 19R CAT II NA</Typography>
                <Typography color="gray">IAD NAV ILS RWY 19R CAT II NA</Typography>
                <Typography color="gray">IAD NAV ILS RWY 19R CAT II NA</Typography>
                <Typography color="gray">IAD NAV ILS RWY 19R CAT II NA</Typography>
                <Typography color="gray">IAD NAV ILS RWY 19R CAT II NA</Typography>
                <Typography color="gray">IAD NAV ILS RWY 19R CAT II NA</Typography>
                <Typography color="gray">IAD NAV ILS RWY 19R CAT II NA</Typography>
                <Typography color="gray">IAD NAV ILS RWY 19R CAT II NA</Typography>
            </Grid2>
            <Grid2 size={3} sx={{border: 1,}}>
                <Typography variant="h6">TMU</Typography>
                <Typography color="orange" fontWeight="bold">ALT via FLASK --- 10 MIT</Typography>
                <Typography color="orange" fontWeight="bold">CLT via AIROW --- 20 MIT</Typography>
                <Typography color="orange" fontWeight="bold">JFK via SIE --- 25 MIT</Typography>
                <Typography color="orange" fontWeight="bold">SWAP -- CYYZ VIA RICCS - DCT SFK/**</Typography>
            </Grid2>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h6">RADAR ONLINE</Typography>
                <Typography color="cyan"><b>IAD_A_APP</b> {'--->'} 125.050</Typography>
                <Typography color="cyan"><b>IAD_T_APP</b> {'--->'} 126.650</Typography>
                <Typography color="cyan"><b>IAD_M_APP</b> {'--->'} 126.100</Typography>
                <Typography color="cyan"><b>PCT_APP</b> {'--->'} 119.850</Typography>
                <Typography color="cyan"><b>DC_32_CTR</b> {'--->'} 133.725</Typography>
            </Grid2>
            <Grid2 size={2} sx={{border: 1,}}>
                <Typography variant="h6">RADAR SPLIT</Typography>
                <Typography>SHD 2 WAY DEP DECON</Typography>
                <Typography>STD MULLR/OJAAY</Typography>
            </Grid2>
            <Grid2 size={6} sx={{border: 1,}}>
                <Typography variant="h6">CHARTS</Typography>
                <ButtonGroup variant="outlined" color="info">
                    <Button>APD</Button>
                </ButtonGroup>
                <br/>
                <ButtonGroup variant="outlined" color="error" size="small">
                    <Button>JCOBY4</Button>
                    <Button>JERES2</Button>
                    <Button>BUNZZ3</Button>
                    <Button>CLTCH3</Button>
                </ButtonGroup>
                <br/>
                <ButtonGroup variant="outlined" color="success">
                    <Button>HYPER9</Button>
                    <Button>GIBBZ5</Button>
                    <Button>CAVLR6</Button>
                    <Button>DOCCS3</Button>
                </ButtonGroup>
                <br/>
                <ButtonGroup variant="outlined" color="warning">
                    <Button>ILS 01R</Button>
                    <Button>ILS 01C</Button>
                    <Button>ILS 01L</Button>
                    <Button>ILS 19L</Button>
                </ButtonGroup>
            </Grid2>
            <Grid2 size={2} sx={{border: 1,}}>
                <Button variant="contained" color="inherit">PIREP</Button>
                <Button variant="contained" color="inherit">WX</Button>
                <Button variant="contained" color="success">APD</Button>
                <Button variant="contained" color="secondary">SOP</Button>
                <Button variant="contained" color="secondary">LOA</Button>
                <Button variant="contained" color="info">SET</Button>
                <Button variant="contained" color="warning">POS</Button>
                <Button variant="contained" color="error">EMRG</Button>
            </Grid2>
            <Grid2 size={12} sx={{border: 1,}}>
                <Typography variant="h6">VIEWER</Typography>
            </Grid2>
        </Grid2>
    );
}