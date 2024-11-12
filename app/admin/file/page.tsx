'use client';
import React, {useState} from 'react';
import {Box, Button, Card, CardContent, Checkbox, Divider, FormControlLabel, Typography} from "@mui/material";
import {Download} from "@mui/icons-material";
import {saveAs} from "file-saver";
import {toast} from "react-toastify";
import {ConfigFile, importConfigFile} from "@/actions/config";

export default function Page() {

    const [agree, setAgree] = useState(false);

    const downloadExportFile = () => {
        saveAs('/api/export', `ids-export-${new Date().toUTCString()}.json`);
    }

    const submitConfigFile = async (formData: FormData) => {

        if ((formData.get('config') as File).size === 0) {
            toast.error("No file selected");
            return;
        }

        const configFile = formData.get('config') as File;
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                importConfigFile(json as ConfigFile).then(() => {
                    toast.success("Configuration imported successfully");
                }).catch(() => {
                    toast.error("Error importing configuration, make sure it is unchanged from the export.");
                });
            } catch (e) {
                console.log(e);
                toast.error("Error parsing JSON file");
            }
        };

        reader.onerror = () => {
            toast.error("Error reading file");
        };

        reader.readAsText(configFile);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Import/Export Configuration</Typography>
                <Typography variant="h6" gutterBottom>Export Configuration File</Typography>
                <Button variant="contained" size="large" startIcon={<Download/>}
                        onClick={downloadExportFile}>Download</Button>
                <Divider sx={{my: 2,}}/>
                <Typography variant="h6" gutterBottom>Import Configuration File</Typography>
                <form action={submitConfigFile}>
                    <Box>
                        <input type="file" accept=".json" name="config"/>
                        <Box sx={{color: 'red', my: 2,}}>
                            <Typography variant="h5" gutterBottom>THIS ACTION WILL DELETE THE EXISTING CONFIGURATION
                                PERMANENTLY:</Typography>
                            <Typography>ALL Airports</Typography>
                            <Typography>ALL Airport Runways</Typography>
                            <Typography>ALL Radar Facilities</Typography>
                            <Typography>ALL Radar Sectors</Typography>
                            <Typography>ALL Flow Presets</Typography>
                            <Typography>ALL Flow Preset Runways</Typography>
                            <Typography>ALL Default Radar Consolidations</Typography>
                            <Typography>ALL Airspace Diagrams</Typography>
                        </Box>
                        <FormControlLabel
                            control={<Checkbox name="agree" value={agree} onChange={(e, v) => setAgree(v)}/>}
                            label="Do you understand EVERYTHING above?"/>
                        <Button type="submit" variant="contained" color="error" disabled={!agree}>Activate
                            Configuration</Button>
                    </Box>
                </form>

            </CardContent>
        </Card>
    );
}