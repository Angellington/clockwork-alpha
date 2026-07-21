import { Container, styled } from '@mui/material'

const GlassContainer = styled(Container)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(4),
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.55)',
    boxShadow: '0 18px 45px rgba(0, 0, 0, 0.18)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
}))

export default GlassContainer
