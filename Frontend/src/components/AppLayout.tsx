import { Box } from '@mui/material';
import React from 'react';
import SideMenu from './Navbar/Navbar';
import { AppLayoutRoot, appLayoutStyles } from '../styles/components.styles';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <AppLayoutRoot>
            <SideMenu />
            <Box sx={appLayoutStyles.content}>
                {children}
            </Box>
        </AppLayoutRoot>
    );
};

export default AppLayout;
