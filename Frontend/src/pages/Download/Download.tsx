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
    const { control, handleSubmit, getValues } = useForm<DownloadForm>({
        defaultValues: {
            url: '',
            resolution: " ",
        },
    });
    const url = getValues("url") || '';

    const { videoInfo, fetchData, error, loading } = useYoutube(url);



    const onSubmit = (data: DownloadForm) => {
        fetchData.mutate(data.url);
    }

    const theme = useTheme();

    console.log("videoInfo", videoInfo);

    return (
        <Resource>
            <Box sx={{
                display: 'flex',
                backgroundColor: '#333',
                padding: '1.2rem 8rem'
            }}>
                <Typography color='#fff' >Clockwork Alpha Youtube Finder</Typography>
            </Box>

                    

        </Resource>
    );
}