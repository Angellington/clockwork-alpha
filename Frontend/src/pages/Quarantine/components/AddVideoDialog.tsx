import {
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { PlaylistAdd, Save } from '@mui/icons-material';
import { useState } from 'react';

import { quarantineStyles } from '../../../styles/Quarantine.styles';
import type { QuarantineImportJob, QuarantinePreview, QuarantineVideo } from '../hooks/useQuarantine';

type MutationOptions<TData> = {
    onSuccess?: (data: TData) => void;
    onError?: () => void;
};

type StringMutation<TData> = {
    mutate: (value: string, options?: MutationOptions<TData>) => void;
    isPending: boolean;
    isError: boolean;
};

interface AddVideoDialogProps {
    open: boolean;
    addVideo: StringMutation<QuarantineVideo>;
    previewUrl: StringMutation<QuarantinePreview>;
    startPlaylistImport: StringMutation<QuarantineImportJob>;
    onClose: () => void;
    onImportStarted: (job: QuarantineImportJob) => void;
}

function looksLikePlaylist(url: string) {
    return /[?&]list=/.test(url);
}

function formatDuration(seconds?: number | null) {
    if (!seconds) {
        return '--:--';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function AddVideoDialog({
    addVideo,
    onClose,
    onImportStarted,
    open,
    previewUrl,
    startPlaylistImport,
}: AddVideoDialogProps) {
    const theme = useTheme();
    const [url, setUrl] = useState('');
    const [sendDirectly, setSendDirectly] = useState(false);
    const [preview, setPreview] = useState<QuarantinePreview>();
    const [error, setError] = useState<string>();

    const reset = () => {
        setUrl('');
        setPreview(undefined);
        setError(undefined);
    };

    const close = () => {
        reset();
        onClose();
    };

    const startImport = (targetUrl: string) => {
        startPlaylistImport.mutate(targetUrl, {
            onSuccess: (job) => {
                onImportStarted(job);
                close();
            },
            onError: () => setError('Nao foi possivel iniciar a importacao da playlist.'),
        });
    };

    const saveVideo = (targetUrl: string) => {
        addVideo.mutate(targetUrl, {
            onSuccess: close,
            onError: () => setError('Nao foi possivel salvar este video.'),
        });
    };

    const submit = () => {
        const value = url.trim();
        if (!value) {
            return;
        }

        setError(undefined);

        if (sendDirectly) {
            if (looksLikePlaylist(value)) {
                startImport(value);
            } else {
                saveVideo(value);
            }
            return;
        }

        previewUrl.mutate(value, {
            onSuccess: setPreview,
            onError: () => setError('Nao foi possivel identificar esta URL do YouTube.'),
        });
    };

    const confirm = () => {
        if (!preview) {
            return;
        }

        if (preview.item_type === 'playlist') {
            startImport(preview.url);
        } else {
            saveVideo(preview.url);
        }
    };

    const pending = addVideo.isPending || previewUrl.isPending || startPlaylistImport.isPending;

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={close}
            slotProps={{ paper: { sx: quarantineStyles.dialogPaper } }}
        >
            <DialogTitle>Colocar em quarentena</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    label="URL do YouTube"
                    margin="dense"
                    value={url}
                    onChange={(event) => {
                        setUrl(event.target.value);
                        setPreview(undefined);
                    }}
                    sx={quarantineStyles.input(theme)}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={sendDirectly}
                            onChange={(event) => setSendDirectly(event.target.checked)}
                        />
                    }
                    label="Enviar direto sem previsualizar"
                    sx={{ color: 'rgba(232,237,240,0.72)', mt: 1 }}
                />

                {preview && (
                    <Box sx={quarantineStyles.previewBox}>
                        {preview.thumbnail_url && (
                            <Box
                                component="img"
                                src={preview.thumbnail_url}
                                alt={preview.title}
                                sx={quarantineStyles.previewImage}
                            />
                        )}
                        <Box sx={{ minWidth: 0 }}>
                            <Chip
                                size="small"
                                label={preview.item_type === 'playlist' ? 'Playlist' : 'Video'}
                                sx={{ mb: 1 }}
                            />
                            <Typography sx={quarantineStyles.itemTitle}>{preview.title}</Typography>
                            <Typography variant="body2" sx={quarantineStyles.itemDescription}>
                                {preview.channel ?? 'Canal nao identificado'}
                            </Typography>
                            <Typography variant="body2" sx={quarantineStyles.metaLine}>
                                {preview.item_type === 'playlist'
                                    ? `${preview.video_count ?? 0} videos encontrados`
                                    : formatDuration(preview.duration_seconds)}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={quarantineStyles.dialogActions}>
                <Button onClick={close} sx={quarantineStyles.secondaryButton}>
                    Cancelar
                </Button>
                {preview ? (
                    <Button
                        variant="contained"
                        startIcon={preview.item_type === 'playlist' ? <PlaylistAdd /> : <Save />}
                        disabled={pending}
                        onClick={confirm}
                        sx={quarantineStyles.primaryButton}
                    >
                        {preview.item_type === 'playlist' ? 'Importar playlist' : 'Salvar video'}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        disabled={!url.trim() || pending}
                        onClick={submit}
                        sx={quarantineStyles.primaryButton}
                    >
                        {pending ? 'Carregando...' : sendDirectly ? 'Enviar' : 'Previsualizar'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
