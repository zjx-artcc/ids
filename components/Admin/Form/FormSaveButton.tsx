'use client';
import React from 'react';
import {Save} from "@mui/icons-material";
import {useFormStatus} from 'react-dom'
import {LoadingButton} from "@mui/lab";

export default function FormSaveButton() {

    const {pending} = useFormStatus();

    return (
        <LoadingButton type="submit" loading={pending} variant="contained" size="large" startIcon={<Save/>}>
            Save
        </LoadingButton>
    );
}