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
    OpenInFull,
    PlayCircleOutlined,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { useRef, useState } from 'react';
import type { DragEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router';

import { quarantineStyles } from '../../../styles/Quarantine.styles';
import type { QuarantineItem } from '../hooks/useQuarantine';

interface QuarantineCardProps {
    item: QuarantineItem;
    expanded?: boolean;
    loading?: boolean;
    deleting?: boolean;
    playlistItemId?: number;
    onExpand?: () => void;
    onMarkWatched?: (watched: boolean) => void;
    onDelete?: () => void;
    draggableVideo?: boolean;
    onVideoDragStart?: (videoId: number) => void;
    onVideoDragEnd?: () => void;
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
    onVideoDragEnd,
    onVideoDragStart,
    playlistItemId,
    draggableVideo,
}: QuarantineCardProps) {
    const navigate = useNavigate();
    const isVideo = item.item_type === 'video';
    const [dragging, setDragging] = useState(false);
    const suppressClickRef = useRef(false);

    const stopActionClick = (event: MouseEvent) => {
        event.stopPropagation();
    };

    const openVideo = () => {
        if (isVideo) {
            navigate(`/quarantine/videos/${item.id}`);
        }
    };

    const card = (
        <Box
            draggable={Boolean(draggableVideo && isVideo)}
            onClick={() => {
                if (suppressClickRef.current) {
                    suppressClickRef.current = false;
                    return;
                }

                openVideo();
            }}
            onDragStart={(event: DragEvent<HTMLDivElement>) => {
                if (!isVideo || !draggableVideo) {
                    return;
                }

                suppressClickRef.current = true;
                setDragging(true);
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('application/x-quarantine-video-id', String(item.id));
                event.dataTransfer.setData('text/plain', String(item.id));
                if (playlistItemId) {
                    event.dataTransfer.setData('application/x-quarantine-playlist-item-id', String(playlistItemId));
                }
                onVideoDragStart?.(item.id);
            }}
            onDragEnd={() => {
                setDragging(false);
                onVideoDragEnd?.();
            }}
            sx={{
                ...quarantineStyles.card,
                ...(isVideo ? quarantineStyles.videoCard : {}),
                ...(draggableVideo ? quarantineStyles.draggableCard : {}),
                ...(dragging ? quarantineStyles.draggingCard : {}),
            }}
        >
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
                    {isVideo && item.watched && (
                        <Chip size="small" label="ASSISTIDO" sx={quarantineStyles.watchedFlag} />
                    )}
                </Box>
            </Box>

            <Box sx={quarantineStyles.cardActions}>
                {isVideo ? (
                    <>
                        <Tooltip title={item.watched ? 'Marcar como nao assistido' : 'Marcar como assistido'}>
                            <span>
                                <IconButton
                                    aria-label={item.watched ? 'Marcar como nao assistido' : 'Marcar como assistido'}
                                    sx={quarantineStyles.iconButton}
                                    disabled={loading}
                                    onClick={(event) => {
                                        stopActionClick(event);
                                        onMarkWatched?.(!item.watched);
                                    }}
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

                        <Tooltip title="Excluir video definitivamente">
                            <IconButton
                                aria-label="Excluir video definitivamente"
                                disabled={deleting}
                                sx={quarantineStyles.iconButton}
                                onClick={(event) => {
                                    stopActionClick(event);
                                    onDelete?.();
                                }}
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
                                onClick={(event) => {
                                    stopActionClick(event);
                                    onExpand?.();
                                }}
                            >
                                {loading ? <CircularProgress size={20} /> : expanded ? <CheckCircleOutlined /> : <OpenInFull />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Excluir playlist definitivamente">
                            <IconButton
                                aria-label="Excluir playlist definitivamente"
                                disabled={deleting}
                                sx={quarantineStyles.iconButton}
                                onClick={(event) => {
                                    stopActionClick(event);
                                    onDelete?.();
                                }}
                            >
                                {deleting ? <CircularProgress size={20} /> : <DeleteOutlined />}
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>
        </Box>
    );

    return isVideo ? (
        <Tooltip title={item.title} placement="top" arrow>
            {card}
        </Tooltip>
    ) : card;
}
