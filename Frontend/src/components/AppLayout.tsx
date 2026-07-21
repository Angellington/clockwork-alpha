import { Box } from '@mui/material';
import React from 'react';
import SideMenu from './Navbar/Navbar';
import { styled } from '@mui/material/styles';

interface AppLayoutProps {
    children: React.ReactNode;
}

const Layout = styled(Box)(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
}));

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <Layout>
            <SideMenu />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                {children}
            </Box>
        </Layout>
    );
};

export default AppLayout
