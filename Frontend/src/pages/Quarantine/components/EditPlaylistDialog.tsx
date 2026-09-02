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
import { Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { quarantineStyles } from '../../../styles/Quarantine.styles';
import type { QuarantineItem, QuarantinePlaylist } from '../hooks/useQuarantine';

type EditPlaylistMutation = {
    mutate: (
        value: { playlistId: number; name: string; description?: string },
        options?: { onSuccess?: (data: QuarantinePlaylist) => void; onError?: () => void },
    ) => void;
    isPending: boolean;
};

interface EditPlaylistDialogProps {
    playlist?: QuarantineItem;
    updatePlaylist: EditPlaylistMutation;
    onClose: () => void;
}

export default function EditPlaylistDialog({ playlist, updatePlaylist, onClose }: EditPlaylistDialogProps) {
    const theme = useTheme();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string>();

    useEffect(() => {
        setName(playlist?.title ?? '');
        setDescription(playlist?.description ?? '');
        setError(undefined);
    }, [playlist]);

    const close = () => {
        setError(undefined);
        onClose();
    };

    const submit = () => {
        const cleanName = name.trim();
        if (!playlist || !cleanName) {
            setError('Informe um nome para a playlist.');
            return;
        }

        updatePlaylist.mutate(
            { playlistId: playlist.id, name: cleanName, description: description.trim() || undefined },
            { onSuccess: close, onError: () => setError('Nao foi possivel atualizar a playlist.') },
        );
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={Boolean(playlist)}
            onClose={close}
            slotProps={{ paper: { sx: quarantineStyles.dialogPaper } }}
        >
            <DialogTitle>Editar playlist</DialogTitle>
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
                        if (event.key === 'Enter') submit();
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
                {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
            </DialogContent>
            <DialogActions sx={quarantineStyles.dialogActions}>
                <Button onClick={close} sx={quarantineStyles.secondaryButton}>Cancelar</Button>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    disabled={!name.trim() || updatePlaylist.isPending}
                    onClick={submit}
                    sx={quarantineStyles.primaryButton}
                >
                    {updatePlaylist.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
