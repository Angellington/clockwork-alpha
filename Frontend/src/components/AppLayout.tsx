import { Box } from '@mui/material';
import React from 'react';
import SideMenu from './Navbar/Navbar';
import { styled } from '@mui/material/styles';

interface AppLayoutProps {
    children: React.ReactNode;
}

const Layout = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    backgroundColor: theme.palette.primary.main,
}));

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <Layout>
            <SideMenu />
            {children}
        </Layout>
    );
};

export default AppLayout