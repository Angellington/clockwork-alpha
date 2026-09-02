import {
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    CheckCircleOutlined,
    DeleteOutlined,
    Folder,
    LinkOff,
    OpenInFull,
    PlayCircleOutlined,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

import { quarantineStyles } from '../../../styles/Quarantine.styles';
import type { QuarantineItem } from '../hooks/useQuarantine';

interface QuarantineCardProps {
    item: QuarantineItem;
    expanded?: boolean;
    loading?: boolean;
    deleting?: boolean;
    removing?: boolean;
    playlistItemId?: number;
    onExpand?: () => void;
    onMarkWatched?: () => void;
    onDelete?: () => void;
    onRemoveFromPlaylist?: () => void;
}

function formatDuration(seconds?: number | null) {
    if (!seconds) {
        return '--:--';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function compactDescription(description?: string | null) {
    if (!description) {
        return 'Sem descricao salva para este item.';
    }

    if (description.length <= 190) {
        return description;
    }

    return `${description.slice(0, 190).trim()}...`;
}

export default function QuarantineCard({
    deleting,
    expanded,
    item,
    loading,
    onDelete,
    onExpand,
    onMarkWatched,
    onRemoveFromPlaylist,
    playlistItemId,
    removing,
}: QuarantineCardProps) {
    const navigate = useNavigate();
    const isVideo = item.item_type === 'video';

    return (
        <Box sx={quarantineStyles.card}>
            <Box sx={quarantineStyles.thumbnail}>
                {item.thumbnail_url ? (
                    <Box
                        component="img"
                        src={item.thumbnail_url}
                        alt={item.title}
                        sx={quarantineStyles.thumbnailImage}
                    />
                ) : (
                    <Box sx={quarantineStyles.thumbnailFallback}>
                        {isVideo ? <PlayCircleOutlined /> : <Folder />}
                    </Box>
                )}

                <Chip size="small" label={formatDuration(item.duration_seconds)} sx={quarantineStyles.duration} />
            </Box>

            <Box sx={quarantineStyles.meta}>
                <Typography component="h2" sx={quarantineStyles.itemTitle}>
                    {item.title}
                </Typography>

                <Typography variant="body2" sx={quarantineStyles.itemDescription}>
                    {compactDescription(item.description)}
                </Typography>

                <Box sx={quarantineStyles.metaLine}>
                    <span>{isVideo ? 'Video' : 'Playlist'}</span>
                    {item.channel && <span>{item.channel}</span>}
                    {isVideo && (
                        <span>{item.watched ? 'Assistido' : 'Nao assistido'}</span>
                    )}
                </Box>
            </Box>

            <Box sx={quarantineStyles.cardActions}>
                {isVideo ? (
                    <>
                        <Tooltip title="Abrir video">
                            <IconButton
                                aria-label="Abrir video"
                                sx={quarantineStyles.iconButton}
                                onClick={() => navigate(`/quarantine/videos/${item.id}`)}
                            >
                                <PlayCircleOutlined />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={item.watched ? 'Video assistido' : 'Marcar como assistido'}>
                            <span>
                                <IconButton
                                    aria-label="Marcar como assistido"
                                    sx={quarantineStyles.iconButton}
                                    disabled={Boolean(item.watched) || loading}
                                    onClick={onMarkWatched}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} />
                                    ) : item.watched ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </span>
                        </Tooltip>

                        {playlistItemId && onRemoveFromPlaylist && (
                            <Tooltip title="Remover da playlist">
                                <IconButton
                                    aria-label="Remover da playlist"
                                    disabled={removing}
                                    sx={quarantineStyles.iconButton}
                                    onClick={onRemoveFromPlaylist}
                                >
                                    {removing ? <CircularProgress size={20} /> : <LinkOff />}
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="Excluir video definitivamente">
                            <IconButton
                                aria-label="Excluir video definitivamente"
                                disabled={deleting}
                                sx={quarantineStyles.iconButton}
                                onClick={onDelete}
                            >
                                {deleting ? <CircularProgress size={20} /> : <DeleteOutlined />}
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Tooltip title={expanded ? 'Recolher playlist' : 'Abrir playlist'}>
                            <IconButton
                                aria-label={expanded ? 'Recolher playlist' : 'Abrir playlist'}
                                sx={quarantineStyles.iconButton}
                                onClick={onExpand}
                            >
                                {loading ? <CircularProgress size={20} /> : expanded ? <CheckCircleOutlined /> : <OpenInFull />}
                            </IconButton>
                        </Tooltip>

                        {playlistItemId && onRemoveFromPlaylist && (
                            <Tooltip title="Remover da playlist">
                                <IconButton
                                    aria-label="Remover da playlist"
                                    disabled={removing}
                                    sx={quarantineStyles.iconButton}
                                    onClick={onRemoveFromPlaylist}
                                >
                                    {removing ? <CircularProgress size={20} /> : <LinkOff />}
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="Excluir playlist definitivamente">
                            <IconButton
                                aria-label="Excluir playlist definitivamente"
                                disabled={deleting}
                                sx={quarantineStyles.iconButton}
                                onClick={onDelete}
                            >
                                {deleting ? <CircularProgress size={20} /> : <DeleteOutlined />}
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>
        </Box>
    );
}
