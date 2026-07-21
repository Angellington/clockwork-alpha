import { styled } from "@mui/material/styles"


export const TitleContainer = styled('div')(({ theme }) => ({
    width: '60%',
    height: '69px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
    backgroundColor: "#333",

    '& .MuiTypography-root': {
        color: 'inherit',
        textAlign: 'center',
    },
}))




