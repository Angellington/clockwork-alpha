import { useForm } from 'react-hook-form';
import { Box, Button, Typography, useTheme } from '@mui/material';

import Resource from '../../components/Resource';
import TextField from '../../components/TextField';
import { useYoutube } from '../../hooks/useYoutube';

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
    const url = control.getValues("url") || '';

    const { videoInfo, fetchData, error, loading } = useYoutube(url);



    const onSubmit = (data: DownloadForm) => {
        fetchData.mutate(data.url);
    }

    const theme = useTheme();


    return (
        <Resource>
            <Typography component={'h1'} variant='h4' sx={{ color: '#fff' }}>
                Set the youtube URL to DOWNLOAD VIDEO
            </Typography>

            <Box sx={{
                display: 'flex',
                gap: 2
            }}>

                <TextField
                    name="url"
                    control={control}
                    label="URL"
                    sx={{
                        width: 500
                    }}
                />



                <Button
                    variant="contained"
                    color="info"
                    onClick={handleSubmit(onSubmit)}
                >
                    Consultar
                </Button>

                {/* <SelectItem name='resolutions' label='Resolutions' control={control} items={resolutions} /> */}

            </Box>
        </Resource>
    );
}