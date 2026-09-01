import { Box, Container, ListItemButton, styled } from '@mui/material';
import { purple } from '@mui/material/colors';

interface MenuBoxProps {
    open: boolean;
    mobile: boolean;
}

export const ResourceLayout = styled(Box)(() => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'column',
    overflow: 'hidden',
}));

export const GlassContainerRoot = styled(Container)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(4),
    borderRadius: 14,
    backgroundColor: 'rgba(7,11,17,0.80)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 26px 70px rgba(0,0,0,0.62), 0 8px 18px rgba(0,0,0,0.38)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
}));

export const AppLayoutRoot = styled(Box)(() => ({
    width: '100%',
    height: '100dvh',
    display: 'flex',
    backgroundColor: 'transparent',
    overflow: 'hidden',
}));

export const TitleContainer = styled('div')(({ theme }) => ({
    width: '60%',
    height: '69px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
    backgroundColor: '#333',

    '& .MuiTypography-root': {
        color: 'inherit',
        textAlign: 'center',
    },

    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

export const MenuBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'mobile',
})<MenuBoxProps>(({ open, mobile, theme }) => ({
    width: open ? 100 : 0,
    position: 'sticky',
    top: 0,
    overflow: 'hidden',
    transition: 'width 0.3s ease',
    paddingTop: '4em',
    background: 'rgba(7,11,17,0.72)',
    boxShadow: '8px 0 22px rgba(0,0,0,0.46)',
    height: '100dvh',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    flexShrink: 0,
    borderRight: '1px solid rgba(255,255,255,0.08)',

    ...(mobile && {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: theme.zIndex.drawer,
        width: open ? 'min(78vw, 280px)' : 0,
        background: 'rgba(7,11,17,0.94)',
    }),
}));

export const MenuButton = styled(ListItemButton)(({ theme }) => ({
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: 80,
    height: 80,
    borderRadius: 8,
    color: 'rgba(247,248,250,0.78)',

    '&:hover': {
        color: '#8BD3DD',
        backgroundColor: 'rgba(139,211,221,0.10)',
    },

    '& .MuiSvgIcon-root': {
        fontSize: 28,
    },

    '& .MuiTypography-root': {
        textAlign: 'center',
        fontSize: '0.75rem',
    },

    [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: 56,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingInline: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,

        '& .MuiSvgIcon-root': {
            fontSize: 24,
        },

        '& .MuiTypography-root': {
            fontSize: '0.9rem',
            textAlign: 'left',
        },
    },
}));

export const appLayoutStyles = {
    content: {
        flex: 1,
        minWidth: 0,
        height: '100dvh',
        overflow: 'hidden',
    },
};

export const navbarStyles = {
    items: (mobile: boolean) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        pt: 2,
        px: mobile ? 2 : 0,
    }),
    mobileOverlay: (zIndex: number) => ({
        position: 'fixed',
        inset: 0,
        zIndex,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    }),
    toggle: (left: number, zIndex: number) => ({
        position: 'fixed',
        top: 16,
        left,
        zIndex,
        transition: 'left 0.3s ease',
        color: '#F7F8FA',
    }),
};

export const searchTextFieldStyles = {
    root: {
        display: 'flex',
        width: '100%',
        alignItems: 'stretch',
        flexDirection: {
            xs: 'column',
            sm: 'row',
        },
    },
    input: {
        flex: 1,
        '& .MuiOutlinedInput-root': {
            borderRadius: {
                xs: '10px 10px 0 0',
                sm: '10px 0 0 10px',
            },
            '& fieldset': {
                borderColor: purple[500],
            },
            '&:hover fieldset': {
                borderColor: purple[700],
            },
            '&.Mui-focused fieldset': {
                borderColor: purple[600],
            },
        },
    },
    button: {
        minWidth: {
            xs: '100%',
            sm: 120,
        },
        minHeight: 56,
        borderRadius: {
            xs: '0 0 10px 10px',
            sm: '0 10px 10px 0',
        },
        borderColor: purple[600],
        boxShadow: 'none',
        marginLeft: {
            xs: 0,
            sm: '-1px',
        },
        marginTop: {
            xs: '-1px',
            sm: 0,
        },
        color: purple[600],
        '&:hover': {
            backgroundColor: purple[700],
            borderColor: purple[700],
            boxShadow: 'none',
            color: 'white',
        },
    },
};
