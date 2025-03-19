'use client';
import React, {useEffect, useState} from 'react';
import {Airport, AirspaceDiagram, Radar, RadarSector} from "@prisma/client";
import {Autocomplete, TextField, Stack, Typography, Box} from "@mui/material";
import FormSaveButton from "@/components/Admin/Form/FormSaveButton";
import {toast} from "react-toastify";
import {createOrUpdateAirspaceDiagram} from "@/actions/airspace";
import {useRouter} from "next/navigation";

export default function AirspaceDiagramForm({airspaceDiagram, allFacilities,}: {
    airspaceDiagram?: AirspaceDiagram,
    allFacilities: { id: string, airport?: Airport, radar?: { id: string, sectors: RadarSector[], } }[]
}) {

    const [options, setOptions] = useState<(Airport | { id: string, identifier: string, radar: Radar, })[]>([]);
    const [selectedOption, setSelectedOption] = useState<Airport | {
        id: string,
        identifier: string,
        radar: Radar,
    } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const radarSectors = allFacilities.flatMap(facility => facility.radar?.sectors.map(sector => ({
                ...sector,
                radar: facility.radar
            })) || []
        ) as unknown as { id: string, identifier: string, radar: Radar, }[];
        const airports = allFacilities.map(facility => facility.airport).filter(Boolean) as Airport[];
        setOptions([...airports, ...radarSectors]);

        if (airspaceDiagram) {
            const defaultOption = airports.find(airport => airport.id === airspaceDiagram.airportId) ||
                radarSectors.find(sector => sector.id === airspaceDiagram.sectorId) || null;
            setSelectedOption(defaultOption);
        }
    }, [allFacilities, airspaceDiagram]);

    const handleSubmit = async (formData: FormData) => {
        if (!selectedOption) {
            toast.error('You must select an airport or radar sector');
            return;
        }
        formData.set('airportId', 'icao' in selectedOption ? selectedOption.id : '');
        formData.set('sectorId', 'icao' in selectedOption ? '' : selectedOption.id);
        formData.set('id', airspaceDiagram?.id || '');

        const {airspaceDiagram: n, errors} = await createOrUpdateAirspaceDiagram(formData);

        if (errors) {
            toast.error(errors.map((error) => error.message).join(', '));
            return;
        }

        console.log(n);

        toast.success('Airspace diagram saved successfully');
        if (!airspaceDiagram) {
            router.push('/admin/airspaces');
        }
    }

    return (
        <form action={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => 'icao' in option ? option.icao : `${option.radar.facilityId} - ${option.identifier}`}
                    value={selectedOption}
                    onChange={(event, newValue) => setSelectedOption(newValue)}
                    renderInput={(params) => <TextField {...params} label="Select Airport or Radar Sector"
                                                        variant="outlined"/>}
                />
                <TextField required fullWidth variant="filled" label="Name" name="name"
                           defaultValue={airspaceDiagram?.name || ''} helperText="Ex. KMCO SOUTH"/>
                <Typography>Upload image:</Typography>
                <input type="file" name="image" accept="image/*"/>
                <Box>
                    <FormSaveButton/>
                </Box>
            </Stack>
        </form>
    );
}