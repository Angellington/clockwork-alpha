import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import {
    DeleteOutlined,
    EditOutlined,
    ExpandLess,
    ExpandMore,
    Folder,
} from '@mui/icons-material';
import { useState } from 'react';

import { quarantineStyles } from '../../../styles/Quarantine.styles';
import QuarantineCard from './QuarantineCard';
import { usePlaylistItems, type PlaylistItem, type QuarantineItem } from '../hooks/useQuarantine';

interface PlaylistAccordionProps {
    item: QuarantineItem;
    onMarkWatched: (videoId: number, watched: boolean) => void;
    onDeleteItem: (item: QuarantineItem) => void;
    onEditPlaylist: (item: QuarantineItem) => void;
    deletingItemKey?: string;
    markingVideoId?: number;
    addingToPlaylistId?: number;
    onDropVideo?: (playlistId: number, videoId: number, sourcePlaylistItemId?: number) => void;
    onVideoDragStart?: (videoId: number) => void;
    onVideoDragEnd?: () => void;
}

function fromPlaylistItem(item: PlaylistItem): QuarantineItem {
    if (item.video_id) {
        return {
            item_type: 'video',
            id: item.video_id,
            title: item.video_title ?? 'Video sem titulo',
            description: item.video_description,
            thumbnail_url: item.video_thumbnail_url,
            duration_seconds: item.video_duration_seconds,
            sort_at: item.video_published_at,
            watched: item.video_watched,
            created_at: item.video_published_at ?? new Date().toISOString(),
        };
    }

    return {
        item_type: 'playlist',
        id: item.child_playlist_id ?? 0,
        title: item.child_playlist_name ?? 'Playlist sem nome',
        description: item.child_playlist_description,
        created_at: item.child_playlist_created_at ?? new Date().toISOString(),
        sort_at: item.child_playlist_created_at,
    };
}

export default function PlaylistAccordion({
    deletingItemKey,
    item,
    markingVideoId,
    addingToPlaylistId,
    onDeleteItem,
    onEditPlaylist,
    onDropVideo,
    onVideoDragEnd,
    onVideoDragStart,
    onMarkWatched,
}: PlaylistAccordionProps) {
    const [expanded, setExpanded] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const childrenQuery = usePlaylistItems(item.id, expanded);
    const addingToThisPlaylist = addingToPlaylistId === item.id;

    return (
        <Box
            sx={{
                display: 'grid',
                gap: 1.25,
                ...quarantineStyles.playlistDropTarget,
                ...(dragOver ? quarantineStyles.playlistDropActive : {}),
            }}
            onDragOver={(event) => {
                if (!onDropVideo) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                event.dataTransfer.dropEffect = 'move';
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
                if (!onDropVideo) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                setDragOver(false);

                const rawVideoId =
                    event.dataTransfer.getData('application/x-quarantine-video-id') ||
                    event.dataTransfer.getData('text/plain');
                const rawPlaylistItemId = event.dataTransfer.getData('application/x-quarantine-playlist-item-id');
                const videoId = Number(rawVideoId);
                const sourcePlaylistItemId = Number(rawPlaylistItemId);

                if (Number.isInteger(videoId) && videoId > 0) {
                    onDropVideo(
                        item.id,
                        videoId,
                        Number.isInteger(sourcePlaylistItemId) && sourcePlaylistItemId > 0
                            ? sourcePlaylistItemId
                            : undefined,
                    );
                }
            }}
        >
            <Box
                role="button"
                tabIndex={0}
                sx={quarantineStyles.playlistRow}
                onClick={() => setExpanded((current) => !current)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setExpanded((current) => !current);
                    }
                }}
            >
                <Box sx={quarantineStyles.playlistRowIcon}>
                    {addingToThisPlaylist || childrenQuery.isFetching ? (
                        <CircularProgress size={20} />
                    ) : (
                        <Folder />
                    )}
                </Box>

                <Box sx={quarantineStyles.playlistRowMeta}>
                    <Typography sx={quarantineStyles.playlistRowTitle}>
                        {item.title}
                    </Typography>
                    <Typography variant="body2" sx={quarantineStyles.playlistRowDescription}>
                        {item.description || 'Playlist sem descricao.'}
                    </Typography>
                </Box>

                <Box sx={quarantineStyles.playlistRowActions}>
                    <Tooltip title="Editar playlist">
                        <IconButton
                            aria-label="Editar playlist"
                            sx={quarantineStyles.iconButton}
                            onClick={(event) => {
                                event.stopPropagation();
                                onEditPlaylist(item);
                            }}
                        >
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Excluir playlist">
                        <IconButton
                            aria-label="Excluir playlist"
                            disabled={deletingItemKey === `${item.item_type}-${item.id}`}
                            sx={quarantineStyles.iconButton}
                            onClick={(event) => {
                                event.stopPropagation();
                                onDeleteItem(item);
                            }}
                        >
                            {deletingItemKey === `${item.item_type}-${item.id}` ? (
                                <CircularProgress size={20} />
                            ) : (
                                <DeleteOutlined />
                            )}
                        </IconButton>
                    </Tooltip>

                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </Box>
            </Box>

            {expanded && (
                <Box sx={quarantineStyles.playlistChildren}>
                    {childrenQuery.isLoading && <CircularProgress size={22} />}

                    {childrenQuery.isError && (
                        <Typography color="error" variant="body2">
                            Nao foi possivel carregar esta playlist.
                        </Typography>
                    )}

                    {!childrenQuery.isLoading && !childrenQuery.isError && childrenQuery.data?.length === 0 && (
                        <Box sx={quarantineStyles.playlistEmpty}>
                            <Typography variant="body2">Arraste um vídeo para cá</Typography>
                        </Box>
                    )}

                    {childrenQuery.data?.map((child) => {
                        const childItem = fromPlaylistItem(child);

                        if (childItem.item_type === 'playlist') {
                            return (
                                <PlaylistAccordion
                                    key={`playlist-${child.item_id}`}
                                    item={childItem}
                                    deletingItemKey={deletingItemKey}
                                    markingVideoId={markingVideoId}
                                    addingToPlaylistId={addingToPlaylistId}
                                    onDeleteItem={onDeleteItem}
                                    onEditPlaylist={onEditPlaylist}
                                    onMarkWatched={onMarkWatched}
                                    onDropVideo={onDropVideo}
                                    onVideoDragStart={onVideoDragStart}
                                    onVideoDragEnd={onVideoDragEnd}
                                />
                            );
                        }

                        return (
                            <QuarantineCard
                                key={`video-${child.item_id}`}
                                item={childItem}
                                deleting={deletingItemKey === `${childItem.item_type}-${childItem.id}`}
                                loading={markingVideoId === childItem.id}
                                playlistItemId={child.item_id}
                                onDelete={() => onDeleteItem(childItem)}
                                onMarkWatched={(watched) => onMarkWatched(childItem.id, watched)}
                                draggableVideo
                                onVideoDragStart={onVideoDragStart}
                                onVideoDragEnd={onVideoDragEnd}
                            />
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}
