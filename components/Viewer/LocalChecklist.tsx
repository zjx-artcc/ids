import React from 'react';
import {Typography, List, ListItem, Checkbox, FormControlLabel} from "@mui/material";

export default function LocalChecklist() {
    return (
        <div>
            <Typography variant="h6">Local Checklist</Typography>
            <List>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Check local weather conditions"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Review NOTAMs"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Coordinate with ground control"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Verify runway status"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Update ATIS"/>
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox/>} label="Monitor airfield lighting"/>
                </ListItem>
            </List>
        </div>
    );
}