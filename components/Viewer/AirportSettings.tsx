'use client';
import React, {useEffect, useState} from 'react';
import {Airport, AirportRunway} from "@prisma/client";
import {fetchAllAirports, updateFlow, updateLocalSplit, updateNotams} from "@/actions/airport";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {toast} from "react-toastify";
import {socket} from "@/lib/socket";

type AirportWithRunways = Airport & {
    runways: AirportRunway[];
};

export default function AirportSettings() {

    const [allAirports, setAllAirports] = useState<AirportWithRunways[]>();
    const [selectedAirport, setSelectedAirport] = useState<AirportWithRunways | null>(null);
    const [runwaySettings, setRunwaySettings] = useState<{
        [key: string]: { inUseDepartureTypes: string[], inUseApproachTypes: string[] }
    }>(selectedAirport?.runways
        .reduce((acc, runway) => ({
            ...acc,
            [runway.id]: {
                inUseDepartureTypes: runway.inUseDepartureTypes,
                inUseApproachTypes: runway.inUseApproachTypes,
            },
        }), {}) || {});
    const [localSplit, setLocalSplit] = useState<string[]>(selectedAirport?.localSplit || []);
    const [notams, setNotams] = useState<string[]>(selectedAirport?.notams || []);

    useEffect(() => {
        if (!allAirports) fetchAllAirports().then(setAllAirports);
        if (selectedAirport) {
            setRunwaySettings(selectedAirport.runways
                .reduce((acc, runway) => ({
                    ...acc,
                    [runway.id]: {
                        inUseDepartureTypes: runway.inUseDepartureTypes,
                        inUseApproachTypes: runway.inUseApproachTypes,
                    },
                }), {}));
            setLocalSplit(selectedAirport.localSplit);
            setNotams(selectedAirport.notams);
        }
    }, [allAirports, selectedAirport]);

    const handleRunwayChange = (runwayId: string, type: 'inUseDepartureTypes' | 'inUseApproachTypes', values: string[]) => {
        setRunwaySettings((prev) => ({
            ...prev,
            [runwayId]: {
                ...prev[runwayId],
                [type]: values,
            },
        }));
    };

    const handleActivate = async () => {
        const {runways, errors} = await updateFlow(selectedAirport?.icao || '', runwaySettings);

        if (errors) {
            toast.error('There was an error updating the flow');
            return;
        }

        toast.success('Flow updated successfully');
        socket.emit(`${selectedAirport?.facilityId}-flow`, runways);
    }

    const saveLocalSplit = async () => {
        const {airport} = await updateLocalSplit(selectedAirport?.id || '', localSplit);

        toast.success('Local Split updated successfully');
        socket.emit(`${airport.facilityId}-lcl-split`, airport.localSplit);
    }

    const saveNotams = async () => {
        const {airport} = await updateNotams(selectedAirport?.id || '', notams);

        toast.success('NOTAMs updated successfully');
        socket.emit(`${airport.facilityId}-notam`, airport.notams);
    }

    const handleLocalSplitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSplit(event.target.value.split('\n'));
    };

    const handleNotamsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotams(event.target.value.split('\n'));
    };

    if (!allAirports) {
        return <CircularProgress/>;
    }

    return (
        <Stack direction="column" spacing={2} sx={{mx: 2}}>
            <Card>
                <CardContent>
                    <Autocomplete
                        options={allAirports}
                        getOptionLabel={(option) => option.icao}
                        value={selectedAirport}
                        onChange={(event, newValue) => setSelectedAirport(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Airport" variant="outlined"/>}
                    />
                    <Button variant="contained" size="small" sx={{mt: 2,}} onClick={() => {
                        setSelectedAirport(null);
                        setAllAirports(undefined);
                    }}>Refresh Airports</Button>
                    <Typography>Use this if airport information is not in sync with what is in the IDS.</Typography>
                </CardContent>
            </Card>
            {selectedAirport && (
                <>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{selectedAirport.icao} Settings</Typography>
                            <Stack direction="column" spacing={2}>
                                {selectedAirport.runways.map((runway) => (
                                    <Stack key={runway.id} direction="column" spacing={1}>
                                        <Typography variant="subtitle2">Runway {runway.runwayIdentifier}</Typography>
                                        <Autocomplete
                                            multiple
                                            options={runway.availableDepartureTypes}
                                            value={runwaySettings[runway.id]?.inUseDepartureTypes || []}
                                            onChange={(event, newValue) => handleRunwayChange(runway.id, 'inUseDepartureTypes', newValue)}
                                            renderInput={(params) => <TextField {...params}
                                                                                label={`Select RW${runway.runwayIdentifier} Departure Types`}
                                                                                variant="outlined"/>}
                                        />
                                        <Autocomplete
                                            multiple
                                            options={runway.availableApproachTypes}
                                            value={runwaySettings[runway.id]?.inUseApproachTypes || []}
                                            onChange={(event, newValue) => handleRunwayChange(runway.id, 'inUseApproachTypes', newValue)}
                                            renderInput={(params) => <TextField {...params}
                                                                                label={`Select RW${runway.runwayIdentifier} Approach Types`}
                                                                                variant="outlined"/>}
                                        />
                                    </Stack>
                                ))}
                                <Box>
                                    <Button variant="contained" onClick={handleActivate}>Save Flow</Button>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{selectedAirport.icao} Information</Typography>
                            <TextField
                                label="Local Split"
                                placeholder="Separate each entry with a new line"
                                variant="outlined"
                                value={localSplit.join('\n')}
                                onChange={handleLocalSplitChange}
                                fullWidth
                                multiline
                                sx={{mb: 1,}}
                            />
                            <Button variant="contained" onClick={saveLocalSplit} sx={{mb: 2,}}>Save Local Split</Button>
                            <TextField
                                label="NOTAMs"
                                placeholder="Separate each NOTAM with a new line"
                                variant="outlined"
                                value={notams.join('\n')}
                                onChange={handleNotamsChange}
                                fullWidth
                                multiline
                                sx={{mb: 1,}}
                            />
                            <Button variant="contained" onClick={saveNotams}>Save NOTAMs</Button>
                        </CardContent>
                    </Card>
                </>
            )}
        </Stack>
    );
}