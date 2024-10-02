'use server';

export const fetchCharts = async (icao: string) => {
    const response = await fetch(`https://api.aviationapi.com/v1/charts?apt=${icao}`);
    return response.json();
}