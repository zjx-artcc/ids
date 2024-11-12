'use client';
import React, {useEffect} from 'react';
import {Box, Button, ButtonGroup, CircularProgress} from "@mui/material";
import {fetchCharts} from "@/actions/charts";
import {usePathname, useRouter} from "next/navigation";
import {toast} from "react-toastify";

export default function AirportCharts({icao}: { icao: string, }) {

    const [charts, setCharts] = React.useState<{ name: string, code: string, url: string, }[]>();
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        fetchCharts(icao).then((data) => {

            if (!data[icao]) {
                setCharts([]);
                toast.error('No charts found for this ICAO.');
                return;
            }

            const sortedCharts = (data[icao] as {
                chart_name: string,
                chart_code: string,
                pdf_path: string,
            }[]).map((chart) => ({
                name: chart.chart_name,
                code: chart.chart_code,
                url: chart.pdf_path,
            })).sort((a, b) => {
                const order = ['APD', 'DP', 'STAR', 'IAP', 'MIN'];
                return order.indexOf(a.code) - order.indexOf(b.code);
            });
            setCharts(sortedCharts);
        });
    }, [icao]);

    const chartsGroupedByCode = charts?.reduce((acc, chart) => {
        if (!acc[chart.code]) {
            acc[chart.code] = [];
        }
        acc[chart.code].push(chart);
        return acc;
    }, {} as Record<string, { name: string, code: string, url: string }[]>);

    const navigateToChart = (url: string) => {
        const search = new URLSearchParams({
            viewer: 'url',
            url,
        });
        router.push(`${pathName}?${search.toString()}#viewer`, {
            scroll: true,
        });
    };

    return (
        <Box height={250} sx={{overflow: 'auto'}}>
            {!charts && <CircularProgress/>}
            {Object.entries(chartsGroupedByCode || {}).map(([code, charts]) => (
                <ButtonGroup
                    key={icao + 'charts' + code}
                    variant="outlined"
                    size="small"
                    color={getChartColor(code)}
                    sx={{mb: 2, flexWrap: 'wrap', 
                        '& .MuiButtonGroup-middleButton,.MuiButtonGroup-firstButton, .MuiButtonGroup-lastButton': {
                            borderRightColor: "var(--variant-outlinedBorder)",
                            borderTopRightRadius: "inherit",
                            borderBottomRightRadius: "inherit",
                            borderTopLeftRadius: 'inherit',
                            borderBottomLeftRadius: 'inherit',
                            marginLeft: 0,
                            marginBottom: '5px',
                            marginRight: '5px'
                        },
                        marginLeft:'5px'}}
                >
                    {charts.map((chart) => (
                        <Button key={chart.url} onClick={() => navigateToChart(chart.url)}>{chart.name}</Button>
                    ))}
                </ButtonGroup>
            ))}
        </Box>
    );

}

export const getChartColor = (chartCode: string) => {
    switch (chartCode) {
        case 'APD':
            return 'info';
        case 'DP':
            return 'error';
        case 'STAR':
            return 'success';
        case 'IAP':
            return 'warning';
        case 'MIN':
            return 'secondary';
        default:
            return 'inherit';
    }
}