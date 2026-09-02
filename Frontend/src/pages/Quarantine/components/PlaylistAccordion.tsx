import { Box, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';

import { quarantineStyles } from '../../../styles/Quarantine.styles';
import QuarantineCard from './QuarantineCard';
import { usePlaylistItems, type PlaylistItem, type QuarantineItem } from '../hooks/useQuarantine';

interface PlaylistAccordionProps {
    item: QuarantineItem;
    onMarkWatched: (videoId: number) => void;
    onDeleteItem: (item: QuarantineItem) => void;
    onRemovePlaylistItem: (itemId: number) => void;
    deletingItemKey?: string;
    removingItemId?: number;
    playlistItemId?: number;
    markingVideoId?: number;
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
        created_at: item.child_playlist_created_at ?? new Date().toISOString(),
        sort_at: item.child_playlist_created_at,
    };
}

export default function PlaylistAccordion({
    deletingItemKey,
    item,
    markingVideoId,
    onDeleteItem,
    onMarkWatched,
    onRemovePlaylistItem,
    playlistItemId,
    removingItemId,
}: PlaylistAccordionProps) {
    const [expanded, setExpanded] = useState(false);
    const childrenQuery = usePlaylistItems(item.id, expanded);

    return (
        <Box sx={{ display: 'grid', gap: 1.25 }}>
            <QuarantineCard
                item={item}
                expanded={expanded}
                deleting={deletingItemKey === `${item.item_type}-${item.id}`}
                loading={childrenQuery.isFetching}
                playlistItemId={playlistItemId}
                removing={playlistItemId ? removingItemId === playlistItemId : false}
                onDelete={() => onDeleteItem(item)}
                onRemoveFromPlaylist={playlistItemId ? () => onRemovePlaylistItem(playlistItemId) : undefined}
                onExpand={() => setExpanded((current) => !current)}
            />

            {expanded && (
                <Box sx={quarantineStyles.playlistChildren}>
                    {childrenQuery.isLoading && <CircularProgress size={22} />}

                    {childrenQuery.isError && (
                        <Typography color="error" variant="body2">
                            Nao foi possivel carregar esta playlist.
                        </Typography>
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
                                    removingItemId={removingItemId}
                                    playlistItemId={child.item_id}
                                    onDeleteItem={onDeleteItem}
                                    onRemovePlaylistItem={onRemovePlaylistItem}
                                    onMarkWatched={onMarkWatched}
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
                                removing={removingItemId === child.item_id}
                                onDelete={() => onDeleteItem(childItem)}
                                onRemoveFromPlaylist={() => onRemovePlaylistItem(child.item_id)}
                                onMarkWatched={() => onMarkWatched(childItem.id)}
                            />
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}
