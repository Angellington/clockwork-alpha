import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';

import api from '../../settings/api';
import { quarantineStyles } from '../../styles/Quarantine.styles';
import type { QuarantineVideo } from './hooks/useQuarantine';

function embedUrl(videoId?: string) {
    if (!videoId) {
        return '';
    }

    return `https://www.youtube.com/embed/${videoId}?cc_load_policy=1&rel=0&modestbranding=1`;
}

export default function QuarantinePlayer() {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const query = useQuery({
        queryKey: ['quarantine-video', videoId],
        enabled: Boolean(videoId),
        queryFn: async () => {
            const { data } = await api.get(`/quarantine/videos/${videoId}`);
            return data as QuarantineVideo;
        },
    });

    return (
        <Box sx={quarantineStyles.route}>
            <Box sx={quarantineStyles.shell}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/quarantine')}
                    sx={quarantineStyles.secondaryButton}
                >
                    Voltar
                </Button>

                {query.isLoading && (
                    <Box sx={{ ...quarantineStyles.empty, mt: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {query.data && (
                    <Box sx={{ display: 'grid', gap: 2.5, mt: 3 }}>
                        <Box
                            component="iframe"
                            src={embedUrl(query.data.youtube_video_id)}
                            title={query.data.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            sx={{
                                width: '100%',
                                aspectRatio: '16 / 9',
                                border: 0,
                                borderRadius: 2,
                                backgroundColor: '#000',
                            }}
                        />

                        <Box>
                            <Typography component="h1" sx={quarantineStyles.title}>
                                {query.data.title}
                            </Typography>
                            {query.data.channel && (
                                <Typography sx={quarantineStyles.subtitle}>
                                    {query.data.channel}
                                </Typography>
                            )}
                            {query.data.description && (
                                <Typography sx={{ ...quarantineStyles.subtitle, mt: 2, whiteSpace: 'pre-line' }}>
                                    {query.data.description}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
