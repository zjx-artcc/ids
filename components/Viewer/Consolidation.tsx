'use client';
import React, {useEffect, useState} from 'react';
import {DefaultRadarConsolidation, Radar, RadarConsolidation, RadarSector, User} from "@prisma/client";
import {
    createConsolidation,
    fetchAllConsolidations,
    updateConsolidation,
    deleteConsolidation
} from "@/actions/radarConsolidation";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Autocomplete,
    TextField,
    Button,
    Divider,
    CircularProgress
} from "@mui/material";
import {fetchAllRadarSectors} from "@/actions/radarSector";
import {toast} from "react-toastify";
import {socket} from "@/lib/socket";
import {Delete, Edit} from "@mui/icons-material";
import {fetchAllDefaultRadarConsolidations} from "@/actions/defaultRadarConsolidation";

type Consolidation = RadarConsolidation & {
    primarySector: RadarSectorWithRadar;
    secondarySectors: RadarSectorWithRadar[];
    user: User;
}

type RadarSectorWithRadar = RadarSector & {
    radar: Radar;
}

type DefaultRadarConsolidationWithSectors = DefaultRadarConsolidation & {
    primarySector: RadarSectorWithRadar;
    secondarySectors: RadarSectorWithRadar[];
}

export default function Consolidation() {

    const [allRadarConsolidations, setAllRadarConsolidations] = useState<Consolidation[]>();
    const [allRadarSectors, setAllRadarSectors] = useState<RadarSectorWithRadar[]>();
    const [allDefaultConsolidations, setAllDefaultConsolidations] = useState<DefaultRadarConsolidationWithSectors[]>();
    const [primarySector, setPrimarySector] = useState<RadarSectorWithRadar | null>(null);
    const [secondarySectors, setSecondarySectors] = useState<RadarSectorWithRadar[]>([]);
    const [editMode, setEditMode] = useState<string | null>(null);

    useEffect(() => {
        fetchAllConsolidations().then(setAllRadarConsolidations);
        fetchAllRadarSectors().then(setAllRadarSectors);
        fetchAllDefaultRadarConsolidations().then(setAllDefaultConsolidations);
    }, []);

    const handleEditToggle = (id: string | null, consolidation?: Consolidation) => {
        if (consolidation) {
            setPrimarySector(consolidation.primarySector);
            setSecondarySectors(consolidation.secondarySectors);
        } else {
            setPrimarySector(null);
            setSecondarySectors([]);
        }
        setEditMode(id);
    };

    const handleSave = async () => {
        if (!primarySector) {
            toast.error('Primary sector is required');
            return;
        }
        if (secondarySectors.some(sector => sector.id === primarySector.id)) {
            toast.error('Primary sector cannot be a secondary sector');
            return;
        }

        if (editMode) {
            const {error} = await updateConsolidation(editMode, primarySector.id, secondarySectors.map(sector => sector.id));
            if (error) {
                toast.error(error);
                return;
            }
            toast.success('Consolidation updated successfully');
        } else {
            const {error} = await createConsolidation(primarySector.id, secondarySectors.map(sector => sector.id));
            if (error) {
                toast.error(error);
                return;
            }
            toast.success('Consolidation created successfully');
        }

        fetchAllConsolidations().then(setAllRadarConsolidations);
        setPrimarySector(null);
        setSecondarySectors([]);
        setEditMode(null);
        socket.emit('radar-consolidation');
    };

    const handleDelete = async (id: string) => {
        await deleteConsolidation(id);
        toast.success('Consolidation deleted successfully');
        fetchAllConsolidations().then(setAllRadarConsolidations);
        socket.emit('radar-consolidation');
    };

    const handleDefaultConsolidationSelect = (newValue: DefaultRadarConsolidationWithSectors | null) => {
        if (newValue) {
            setPrimarySector(newValue.primarySector);
            setSecondarySectors(newValue.secondarySectors);
        }
    };

    return (
        <Box sx={{mx: 2}}>
            <Card sx={{mb: 2}}>
                <CardContent>
                    <Typography variant="h6">Active Radar Consolidations</Typography>
                    {(!allRadarConsolidations || !allRadarSectors) && <CircularProgress/>}
                    {allRadarConsolidations?.map((consolidation, index) => (
                        <Box key={index} sx={{mb: 2}}>
                            <Typography
                                variant="subtitle2">{consolidation.primarySector.identifier} - {consolidation.user.fullName}</Typography>
                            <Divider/>
                            {editMode === consolidation.id ? (
                                <>
                                    <Autocomplete
                                        options={allRadarSectors || []}
                                        getOptionLabel={(option) => `${option.radar.facilityId} - ${option.identifier}`}
                                        value={primarySector}
                                        onChange={(event, newValue) => setPrimarySector(newValue)}
                                        renderInput={(params) => <TextField {...params} label="Select Primary Sector"
                                                                            variant="outlined"
                                                                            helperText="This is the sector you are logged into VATSIM as."/>}
                                        sx={{mb: 2}}
                                    />
                                    <Autocomplete
                                        multiple
                                        options={allRadarSectors || []}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => `${option.radar.facilityId} - ${option.identifier}`}
                                        value={secondarySectors}
                                        onChange={(event, newValue) => setSecondarySectors(newValue)}
                                        renderInput={(params) => <TextField {...params} label="Select Secondary Sectors"
                                                                            variant="outlined"
                                                                            helperText="Leave blank if you are only assuming the FULLY DECONSOLIDATED version of the primary sector. (Ex. K -> K)"/>}
                                        sx={{mb: 2}}
                                    />
                                    <Button variant="contained" onClick={handleSave} sx={{mr: 2}}>
                                        Save
                                    </Button>
                                    <Button variant="contained" onClick={() => handleEditToggle(null)}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {consolidation.secondarySectors.length === 0 &&
                                        <Typography variant="body2">FULLY DE-CONSOLIDATED</Typography>}
                                    {consolidation.secondarySectors.map((sector, index) => (
                                        <Typography key={index} variant="body2">{sector.identifier}</Typography>
                                    ))}
                                    <Box sx={{mt: 1,}}>
                                        <Button variant="contained" size="small" startIcon={<Edit/>}
                                                onClick={() => handleEditToggle(consolidation.id, consolidation)}
                                                sx={{mr: 2}}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" size="small" startIcon={<Delete/>}
                                                onClick={() => handleDelete(consolidation.id)}>
                                            Delete/Offline
                                        </Button>
                                    </Box>

                                </>
                            )}
                        </Box>
                    ))}
                </CardContent>
            </Card>
            {!editMode && allRadarSectors && <Card>
                <CardContent>
                    <Typography variant="h6">New Radar Consolidation</Typography>
                    <Autocomplete
                        options={allRadarSectors || []}
                        getOptionLabel={(option) => `${option.radar.facilityId} - ${option.identifier}`}
                        value={primarySector}
                        onChange={(event, newValue) => setPrimarySector(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Primary Sector" variant="outlined"
                                                            helperText="This is the sector you are logged into VATSIM as."/>}
                        sx={{mb: 2}}
                    />
                    <Autocomplete
                        multiple
                        options={allRadarSectors || []}
                        disableCloseOnSelect
                        getOptionLabel={(option) => `${option.radar.facilityId} - ${option.identifier}`}
                        value={secondarySectors}
                        onChange={(event, newValue) => setSecondarySectors(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Secondary Sectors"
                                                            variant="outlined"
                                                            helperText="Leave blank if you are only assuming the FULLY DECONSOLIDATED version of the primary sector. (Ex. K -> K)"/>}
                        sx={{mb: 2}}
                    />
                    <Autocomplete
                        options={allDefaultConsolidations || []}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => handleDefaultConsolidationSelect(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Default Consolidation"
                                                            variant="outlined"
                                                            helperText="Select a default consolidation to pre-fill the primary and secondary sectors."/>}
                        sx={{mb: 2}}
                    />
                    <Button variant="contained" onClick={handleSave}>
                        Create
                    </Button>
                </CardContent>
            </Card>}
        </Box>
    );
}