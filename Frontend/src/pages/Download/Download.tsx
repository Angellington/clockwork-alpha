import { useForm } from 'react-hook-form';
import { Box, CircularProgress, Typography } from '@mui/material';

import Resource from '../../components/Resource';
import { SearchTextField } from '../../components/TextField';
import { useYoutube } from '../../hooks/useYoutube';
import { TitleContainer } from './Components/Title';
import GlassContainer from '../../components/GlassContainer';

interface DownloadForm {
    url: string;
    resolution: string;
}




export default function Download() {
    const { control, handleSubmit } = useForm<DownloadForm>({
        defaultValues: {
            url: '',
            resolution: " ",
        },
    });

    const { fetchData, loading } = useYoutube();



    const onSubmit = (data: DownloadForm) => {
        fetchData.mutate(data.url);
    }

    return (
        <Resource>
            <TitleContainer>
                <Typography>Clockwork Alpha Youtube Finder</Typography>
            </TitleContainer>
            <GlassContainer
                maxWidth="md"
                sx={{
                    width: {
                        xs: 'calc(100% - 32px)',
                        sm: '80%',
                    },
                    px: {
                        xs: 2,
                        sm: 4,
                    },
                    py: {
                        xs: 3,
                        sm: 4,
                    },
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <SearchTextField
                        name="url"
                        control={control}
                        loading={loading}
                        label={"URL"}
                        fullWidth
                    />

                    {loading && (
                        <Box
                            sx={{
                                minHeight: 120,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}
                        >
                            <CircularProgress />
                            <Typography variant="body2" color="text.secondary">
                                Buscando informacoes do video...
                            </Typography>
                        </Box>
                    )}
                </Box>
            </GlassContainer>

        </Resource>
    );
}
