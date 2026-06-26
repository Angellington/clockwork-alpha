import { AudioFile, Download, GraphicEq, MicOff, SortSharp } from '@mui/icons-material';
import {
    Box,
    IconButton,
    ListItem,
    ListItemButton,
    Typography,
    styled,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const items = [
    { label: 'Download Youtube', icon: <Download />, path: '/download' },
    { label: 'Extract WAV', icon: <AudioFile />, path: '/extract' },
    { label: 'Vocal Remover', icon: <MicOff />, path: '/vocal-remover' },
    { label: 'Levelator Audio', icon: <GraphicEq />, path: '/levelator' },
];

interface MenuBoxProps {
    open: boolean;
}

const MENU_WIDTH = 100;

const MenuBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open',
})<MenuBoxProps>(({ open }) => ({
    width: open ? MENU_WIDTH : 0,
    overflow: 'hidden',
    transition: 'width 0.3s ease',
    paddingTop: '4em',
    background: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,.1)',
    height: '100vh',

    flexShrink: 0,
}));

const MenuButton = styled(ListItemButton)(({ theme }) => ({
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: 80,
    height: 80,
    borderRadius: theme.shape.borderRadius * 2,

    '& .MuiSvgIcon-root': {
        fontSize: 28,
    },

    '& .MuiTypography-root': {
        textAlign: 'center',
        fontSize: '0.75rem',
    },
}));

export default function SideMenu() {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

    return (
        <>
            <MenuBox open={open}>
                <Box pt={2}>
                    {items.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <MenuButton onClick={() => navigate(item.path)}>
                                {item.icon}
                                <Typography>{item.label}</Typography>
                            </MenuButton>
                        </ListItem>
                    ))}
                </Box>
            </MenuBox>

            <Box flex={1} position="relative">
                <IconButton
                    onClick={() => setOpen((prev) => !prev)}
                    sx={{
                        position: 'fixed',
                        top: 16,
                        left: 30,
                        zIndex: 1300,
                        '&:hover': {
                            bgcolor: 'background.paper',
                        },
                    }}
                >
                    <SortSharp />
                </IconButton>
            </Box>
        </>
    );
}