import React, {useEffect, useState} from 'react';
import {Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import {AirportRunway, FlowPresetRunway} from '@prisma/client';

interface EditFlowPresetRunwayDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (runway: FlowPresetRunway) => void;
    runway: FlowPresetRunway | null;
    allRunways: AirportRunway[];
}

const EditFlowPresetRunwayDialog: React.FC<EditFlowPresetRunwayDialogProps> = ({
                                                                                   open,
                                                                                   onClose,
                                                                                   onSave,
                                                                                   runway,
                                                                                   allRunways
                                                                               }) => {
    const [selectedRunway, setSelectedRunway] = useState<AirportRunway | null>(null);
    const [selectedDepartureTypes, setSelectedDepartureTypes] = useState<string[]>([]);
    const [selectedApproachTypes, setSelectedApproachTypes] = useState<string[]>([]);

    useEffect(() => {
        if (runway) {
            const foundRunway = allRunways.find(r => r.id === runway.runwayId) || null;
            setSelectedRunway(foundRunway);
            setSelectedDepartureTypes(runway.departureTypes);
            setSelectedApproachTypes(runway.approachTypes);
        }
    }, [runway, allRunways]);

    const handleSave = () => {
        if (runway && selectedRunway) {
            onSave({
                ...runway,
                runwayId: selectedRunway.id,
                departureTypes: selectedDepartureTypes,
                approachTypes: selectedApproachTypes,
            });
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Flow Preset Runway</DialogTitle>
            <DialogContent>
                <Autocomplete
                    options={allRunways}
                    getOptionLabel={(option) => option.runwayIdentifier}
                    value={selectedRunway}
                    onChange={(event, newValue) => setSelectedRunway(newValue)}
                    renderInput={(params) => <TextField {...params} label="Runway" variant="filled" margin="dense"/>}
                />
                {selectedRunway && (
                    <>
                        <Autocomplete
                            multiple
                            options={selectedRunway.availableDepartureTypes}
                            getOptionLabel={(option) => option}
                            value={selectedDepartureTypes}
                            onChange={(event, newValue) => setSelectedDepartureTypes(newValue)}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <Chip {...getTagProps({index})} label={option}/>
                                ))
                            }
                            renderInput={(params) => <TextField {...params} label="Departure Types" variant="filled"
                                                                margin="dense"/>}
                        />
                        <Autocomplete
                            multiple
                            options={selectedRunway.availableApproachTypes}
                            getOptionLabel={(option) => option}
                            value={selectedApproachTypes}
                            onChange={(event, newValue) => setSelectedApproachTypes(newValue)}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <Chip {...getTagProps({index})} label={option}/>
                                ))
                            }
                            renderInput={(params) => <TextField {...params} label="Approach Types" variant="filled"
                                                                margin="dense"/>}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditFlowPresetRunwayDialog;