import React from 'react';
import {Typography, List, ListItem, Checkbox, FormControlLabel} from "@mui/material";

export default function RadarChecklist() {
    return (
        <div>
            <Typography variant="h6">Radar Checklist</Typography>
            <List>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Check radar display settings"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Review current traffic"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Coordinate with adjacent sectors"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Verify equipment status"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Update flight strips"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Monitor weather conditions"/>
                </ListItem>
            </List>
        </div>
    );
}