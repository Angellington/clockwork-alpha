import { createTheme, type ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#2A2829',
            light: '#4A4548',
            dark: '#1A1819',
            contrastText: '#F5F3F4',
        },
        secondary: {
            main: '#7B1FA2',
            light: '#9C27B0',
            dark: '#6A1B9A',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#020406',
            paper: '#080B10',
        },
        text: {
            primary: '#F7F8FA',
            secondary: 'rgba(247,248,250,0.68)',
            disabled: 'rgba(247,248,250,0.36)',
        },
        divider: 'rgba(255,255,255,0.10)',
        action: {
            active: '#8BD3DD',
            hover: 'rgba(139,211,221,0.10)',
            selected: 'rgba(139,211,221,0.16)',
            disabled: 'rgba(247,248,250,0.34)',
            disabledBackground: 'rgba(247,248,250,0.10)',
        },
    },
    typography: {
        fontFamily: ['Inter', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
        h1: {
            fontWeight: 800,
            letterSpacing: 0,
        },
        h2: {
            fontWeight: 800,
            letterSpacing: 0,
        },
        h3: {
            fontWeight: 700,
            letterSpacing: 0,
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: 0,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    color: '#F7F8FA',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: 'none',
                    transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
                },
                outlinedPrimary: {
                    borderColor: 'rgba(255,255,255,0.28)',
                    color: 'rgba(255,255,255,0.92)',
                    '&:hover': {
                        borderColor: '#9C27B0',
                        backgroundColor: 'rgba(156,39,176,0.14)',
                    },
                },
                containedPrimary: {
                    backgroundColor: '#7B1FA2',
                    color: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#9C27B0',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#080B10',
                    border: '1px solid rgba(255,255,255,0.10)',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(2,4,6,0.56)',
                    color: '#F7F8FA',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.18)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(139,211,221,0.62)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#8BD3DD',
                        borderWidth: 1,
                    },
                },
                input: {
                    color: '#F7F8FA',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'rgba(247,248,250,0.62)',
                    '&.Mui-focused': {
                        color: '#8BD3DD',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(255,255,255,0.10)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 700,
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;
