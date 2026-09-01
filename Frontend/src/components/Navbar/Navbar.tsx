import { AudioFile, Close, Download, GraphicEq, MicOff, SortSharp } from '@mui/icons-material';
import {
    Box,
    IconButton,
    ListItem,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MenuBox, MenuButton, navbarStyles } from '../../styles/components.styles';

const items = [
    { label: 'Download Youtube', icon: <Download />, path: '/download' },
    { label: 'Extract WAV', icon: <AudioFile />, path: '/extract' },
    { label: 'Vocal Remover', icon: <MicOff />, path: '/vocal-remover' },
    { label: 'Levelator Audio', icon: <GraphicEq />, path: '/levelator' },
];

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
                <Box sx={navbarStyles.items(isMobile)}>
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
                    sx={navbarStyles.mobileOverlay(theme.zIndex.drawer - 1)}
                />
            )}

            <IconButton
                aria-label={open ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setOpen((prev) => !prev)}
                sx={navbarStyles.toggle(isMobile ? 16 : 30, theme.zIndex.drawer + 1)}
            >
                {isMobile && open ? <Close /> : <SortSharp />}
            </IconButton>
        </>
    );
}
