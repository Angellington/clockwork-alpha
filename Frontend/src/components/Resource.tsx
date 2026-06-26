import { Box, styled } from '@mui/material'

interface AppLayoutProps {
    children: React.ReactNode;
} 

const BoxLayout = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '1.2rem',
}))

const Resource = ({ children }: AppLayoutProps) => {
    return (
        <BoxLayout>
            {children}
        </BoxLayout>
    )
}

export default Resource