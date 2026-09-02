import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { PlaylistAdd, Save } from '@mui/icons-material';
import { useState } from 'react';

import { quarantineStyles } from '../../../styles/Quarantine.styles';
import type { QuarantinePlaylist } from '../hooks/useQuarantine';

type MutationOptions<TData> = {
    onSuccess?: (data: TData) => void;
    onError?: () => void;
};

type CreatePlaylistMutation = {
    mutate: (value: { name: string; description?: string }, options?: MutationOptions<QuarantinePlaylist>) => void;
    isPending: boolean;
};

interface CreatePlaylistDialogProps {
    open: boolean;
    createPlaylist: CreatePlaylistMutation;
    onClose: () => void;
}

export default function CreatePlaylistDialog({
    createPlaylist,
    onClose,
    open,
}: CreatePlaylistDialogProps) {
    const theme = useTheme();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string>();

    const reset = () => {
        setName('');
        setDescription('');
        setError(undefined);
    };

    const close = () => {
        reset();
        onClose();
    };

    const submit = () => {
        const value = name.trim();
        if (!value) {
            setError('Informe um nome para a playlist.');
            return;
        }

        setError(undefined);
        createPlaylist.mutate({ name: value, description: description.trim() || undefined }, {
            onSuccess: close,
            onError: () => setError('Nao foi possivel criar a playlist.'),
        });
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={close}
            slotProps={{ paper: { sx: quarantineStyles.dialogPaper } }}
        >
            <DialogTitle>Criar playlist</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    label="Nome da playlist"
                    margin="dense"
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                        setError(undefined);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            submit();
                        }
                    }}
                    sx={quarantineStyles.input(theme)}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Descricao"
                    margin="dense"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    sx={quarantineStyles.input(theme)}
                />

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
                <Button
                    variant="contained"
                    startIcon={createPlaylist.isPending ? <PlaylistAdd /> : <Save />}
                    disabled={!name.trim() || createPlaylist.isPending}
                    onClick={submit}
                    sx={quarantineStyles.primaryButton}
                >
                    {createPlaylist.isPending ? 'Criando...' : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
