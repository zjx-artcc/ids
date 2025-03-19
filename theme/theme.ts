'use client';
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    colorSchemes: {
        light: false,
        dark: {
            palette: {
                mode: "dark",
                primary: {
                    main: '#47aec7',
                    contrastText: '#EDEDF5',
                },
            }
        },
    },
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#47aec7',
            contrastText: '#EDEDF5',
        }
    }
});

export default theme;