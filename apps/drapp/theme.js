import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    direction: 'rtl',
    status: {
        danger: '#f44336'
    },
    palette: {
        primary: {
            main: '#0070f3'
        },
        secondary: {
            main: '#ff9800'
        }
    },
    typography: {
        fontFamily: '"iransans", "Helvetica", "Arial", sans-serif'
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.4rem',
                    fontSize: '0.85rem'
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#000'
                }
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }
            }
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingRight: '1.5rem',
                    paddingLeft: '1.5rem'
                }
            }
        }
    }
});

export default theme;
