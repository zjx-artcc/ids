'use client';
import React, {useEffect} from 'react';
import {Airport} from "@prisma/client";
import {Box, Button, ButtonGroup, Grid2, Typography} from "@mui/material";
import {fetchCharts} from "@/actions/charts";
import {usePathname, useRouter} from "next/navigation";

export default function AirportChartsGridItem({airport}: { airport: Airport }) {

    const [charts, setCharts] = React.useState<{ name: string, code: string, url: string, }[]>();
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        fetchCharts(airport.icao).then((data) => {
            const sortedCharts = (data[airport.icao] as {
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
    }, [airport]);

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
        <Grid2 size={6} sx={{border: 1,}}>
            <Typography variant="h6">CHARTS</Typography>
            <Box height={250} sx={{overflow: 'auto',}}>
                {Object.entries(chartsGroupedByCode || {}).map(([code, charts]) => (
                    <ButtonGroup
                        key={airport.icao + 'charts' + code}
                        variant="outlined"
                        size="small"
                        color={getChartColor(code)}
                        sx={{mb: 2, flexWrap: 'wrap'}}
                    >
                        {charts.map((chart) => (
                            <Button key={chart.url} onClick={() => navigateToChart(chart.url)}>{chart.name}</Button>
                        ))}
                    </ButtonGroup>
                ))}
            </Box>

        </Grid2>
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