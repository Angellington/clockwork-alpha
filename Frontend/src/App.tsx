import AppLayout from './components/AppLayout';
import { BrowserRouter, Route, Routes } from 'react-router';
import Delicate from './pages/Delicate';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import Download from './pages/Download/Download';
import Quarantine from './pages/Quarantine/Quarantine';
import QuarantinePlayer from './pages/Quarantine/QuarantinePlayer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AppLayout>
                        <Routes>
                            <Route path="/" element={<Delicate />} />
                            <Route path="/download" element={<Download />} />
                            <Route path="/quarantine" element={<Quarantine />} />
                            <Route path="/quarantine/videos/:videoId" element={<QuarantinePlayer />} />
                            {/* <Route path="/memoing" element={<Memoing />} /> */}
                        </Routes>
                    </AppLayout>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
