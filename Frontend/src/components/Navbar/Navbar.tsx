import { AudioFile, Close, Download, GraphicEq, MicOff, SortSharp } from '@mui/icons-material';
import {
    Box,
    IconButton,
    ListItem,
    ListItemButton,
    Typography,
    styled,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const items = [
    { label: 'Download Youtube', icon: <Download />, path: '/download' },
    { label: 'Extract WAV', icon: <AudioFile />, path: '/extract' },
    { label: 'Vocal Remover', icon: <MicOff />, path: '/vocal-remover' },
    { label: 'Levelator Audio', icon: <GraphicEq />, path: '/levelator' },
];

interface MenuBoxProps {
    open: boolean;
    mobile: boolean;
}

const MENU_WIDTH = 100;

const MenuBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'mobile',
})<MenuBoxProps>(({ open, mobile, theme }) => ({
    width: open ? MENU_WIDTH : 0,
    position: 'relative',
    overflow: 'hidden',
    transition: 'width 0.3s ease',
    paddingTop: '4em',
    background: '#f0f0f040',
    boxShadow: '8px 0px 22px 5px rgba(0,0,0,0.5)',
    height: '100dvh',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    flexShrink: 0,

    ...(mobile && {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: theme.zIndex.drawer,
        width: open ? 'min(78vw, 280px)' : 0,
        background: '#f0f0f0d9',
    }),
}));

const MenuButton = styled(ListItemButton)(({ theme }) => ({
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: 80,
    height: 80,
    borderRadius: 8,

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

export default function SideMenu() {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    const handleNavigate = (path: string) => {
        navigate(path);

        if (isMobile) {
            setOpen(false);
        }
    };

    return (
        <>
            <MenuBox open={open} mobile={isMobile}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        pt: 2,
                        px: isMobile ? 2 : 0,
                    }}
                >
                    {items.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <MenuButton onClick={() => handleNavigate(item.path)}>
                                {item.icon}
                                <Typography>{item.label}</Typography>
                            </MenuButton>
                        </ListItem>
                    ))}
                </Box>
            </MenuBox>

            {isMobile && open && (
                <Box
                    onClick={() => setOpen(false)}
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: theme.zIndex.drawer - 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    }}
                />
            )}

            <IconButton
                aria-label={open ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setOpen((prev) => !prev)}
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: isMobile ? 16 : 30,
                    zIndex: theme.zIndex.drawer + 1,
                    transition: 'left 0.3s ease',
                }}
            >
                {isMobile && open ? <Close /> : <SortSharp />}
            </IconButton>
        </>
    );
}
