import { Box } from '@mui/material';
import React from 'react';
import SideMenu from './Navbar/Navbar';
import { styled } from '@mui/material/styles';
import Background from '/images/ClockworkAlpha.png'
interface AppLayoutProps {
    children: React.ReactNode;
}

const Layout = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
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