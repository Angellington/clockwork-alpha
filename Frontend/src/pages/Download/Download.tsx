import { useForm } from 'react-hook-form';
import { Box, Button, Typography, useTheme } from '@mui/material';

import Resource from '../../components/Resource';
import TextField from '../../components/TextField';

interface DownloadForm {
    url: string;
}

export default function Download() {
    const { control, handleSubmit } = useForm<DownloadForm>({
        defaultValues: {
            url: '',
        },
    });

    const onSubmit = (data: DownloadForm) => {
        console.log(data);
    };
    const theme = useTheme();

    return (
        <Resource>
            <Typography component={'h1'} variant='h4' sx={{ color: '#fff'}}>
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

            </Box>
        </Resource>
    );
}