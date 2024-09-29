'use client';
import React from 'react';
import {Facility, TmuNotice} from "@prisma/client";
import {Autocomplete, Box, Button, Chip, Stack, TextField} from "@mui/material";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {createOrUpdateTmu} from "@/actions/tmu";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

export default function TmuForm({tmu, currentFacilities, allFacilities}: {
    tmu?: TmuNotice,
    currentFacilities?: Facility[],
    allFacilities: Facility[]
}) {

    const [facilities, setFacilities] = React.useState(currentFacilities?.map((f) => f.id) || []);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        formData.set('id', tmu?.id || '');
        formData.set('facilities', JSON.stringify(facilities));
        const {errors} = await createOrUpdateTmu(formData);
        if (errors) {
            toast.error(errors.map((error) => error.message).join('. '));
            return;
        }
        toast.success(tmu ? `Updated T.M.U. Notice` : `Created T.M.U. Notice`);
        if (!tmu) {
            router.push('/admin/tmu');
        }
    }

    return (
        <form action={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <TextField fullWidth variant="filled" name="message" defaultValue={tmu?.message || ''} label="Message"
                           required/>
                <Box>
                    <Button variant="outlined" color="inherit" size="small"
                            onClick={() => setFacilities(allFacilities.map((f) => f.id))}>Select all facilities</Button>
                </Box>
                <Autocomplete
                    multiple
                    options={allFacilities}
                    getOptionLabel={(option) => option.id}
                    value={allFacilities.filter((u) => facilities.includes(u.id))}
                    onChange={(event, newValue) => {
                        setFacilities(newValue.map((facility) => facility.id));
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            // eslint-disable-next-line react/jsx-key
                            <Chip {...getTagProps({index})} label={option.id}/>
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="Broadcasted Facilities"/>}
                />
                <Box>
                    <FormSaveButton/>
                </Box>
            </Stack>

        </form>
    );

}