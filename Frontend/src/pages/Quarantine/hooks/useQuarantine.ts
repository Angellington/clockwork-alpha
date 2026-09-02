import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from '../../../settings/api';

export interface QuarantineItem {
    item_type: 'video' | 'playlist';
    id: number;
    title: string;
    description?: string | null;
    channel?: string | null;
    thumbnail_url?: string | null;
    duration_seconds?: number | null;
    sort_at?: string | null;
    watched?: boolean | null;
    created_at: string;
}

export interface PlaylistItem {
    item_id: number;
    position: number;
    video_id?: number | null;
    video_title?: string | null;
    video_url?: string | null;
    video_description?: string | null;
    video_thumbnail_url?: string | null;
    video_duration_seconds?: number | null;
    video_published_at?: string | null;
    video_watched?: boolean | null;
    child_playlist_id?: number | null;
    child_playlist_name?: string | null;
    child_playlist_created_at?: string | null;
}

export interface QuarantineVideo {
    id: number;
    youtube_video_id: string;
    url: string;
    title: string;
    description?: string | null;
    channel?: string | null;
    thumbnail_url?: string | null;
    duration_seconds?: number | null;
    published_at?: string | null;
    watched: boolean;
}

export interface QuarantinePreview {
    item_type: 'video' | 'playlist';
    url: string;
    title: string;
    description?: string | null;
    channel?: string | null;
    thumbnail_url?: string | null;
    duration_seconds?: number | null;
    published_at?: string | null;
    video_count?: number | null;
}

export interface QuarantineImportJob {
    id: string;
    status: 'queued' | 'running' | 'completed' | 'cancelled' | 'failed';
    playlist_id?: number | null;
    total_videos: number;
    processed_videos: number;
    failed_videos: number;
    cancel_reason?: string | null;
}

export function useQuarantine(page = 1, pageSize = 20) {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['quarantine', page, pageSize],
        queryFn: async () => {
            const { data } = await api.get('/quarantine', {
                params: {
                    page,
                    page_size: pageSize,
                },
            });

            return data as { page: number; page_size: number; items: QuarantineItem[] };
        },
    });

    const previewUrl = useMutation({
        mutationFn: async (url: string) => {
            const { data } = await api.post('/quarantine/preview', { url });
            return data as QuarantinePreview;
        },
    });

    const addVideo = useMutation({
        mutationFn: async (url: string) => {
            const { data } = await api.post('/quarantine/videos', { url });
            return data as QuarantineVideo;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quarantine'] });
        },
    });

    const startPlaylistImport = useMutation({
        mutationFn: async (url: string) => {
            const { data } = await api.post('/quarantine/imports/youtube', { url });
            return data as QuarantineImportJob;
        },
    });

    const markWatched = useMutation({
        mutationFn: async (videoId: number) => {
            const { data } = await api.patch(`/quarantine/videos/${videoId}/watched`);
            return data as QuarantineVideo;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quarantine'] });
            queryClient.invalidateQueries({ queryKey: ['quarantine-playlist-items'] });
        },
    });

    const markWatchedBatch = useMutation({
        mutationFn: async (videoIds: number[]) => {
            const { data } = await api.patch('/quarantine/videos/watched/batch', { video_ids: videoIds });
            return data as { videos: QuarantineVideo[] };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quarantine'] });
            queryClient.invalidateQueries({ queryKey: ['quarantine-playlist-items'] });
        },
    });

    const deleteVideo = useMutation({
        mutationFn: async (videoId: number) => {
            const { data } = await api.delete(`/quarantine/videos/${videoId}`);
            return data as QuarantineVideo;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quarantine'] });
            queryClient.invalidateQueries({ queryKey: ['quarantine-playlist-items'] });
        },
    });

    const deleteVideosBatch = useMutation({
        mutationFn: async (videoIds: number[]) => {
            const { data } = await api.delete('/quarantine/videos/batch', {
                data: { video_ids: videoIds },
            });
            return data as { videos: QuarantineVideo[] };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quarantine'] });
            queryClient.invalidateQueries({ queryKey: ['quarantine-playlist-items'] });
        },
    });

    const deletePlaylist = useMutation({
        mutationFn: async (playlistId: number) => {
            const { data } = await api.delete(`/quarantine/playlists/${playlistId}`);
            return data as unknown;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quarantine'] });
            queryClient.invalidateQueries({ queryKey: ['quarantine-playlist-items'] });
        },
    });

    const removePlaylistItem = useMutation({
        mutationFn: async (itemId: number) => {
            const { data } = await api.delete(`/quarantine/items/${itemId}`);
            return data as unknown;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quarantine'] });
            queryClient.invalidateQueries({ queryKey: ['quarantine-playlist-items'] });
        },
    });

    return {
        addVideo,
        deletePlaylist,
        deleteVideo,
        deleteVideosBatch,
        markWatched,
        markWatchedBatch,
        previewUrl,
        query,
        removePlaylistItem,
        startPlaylistImport,
    };
}

export function usePlaylistItems(playlistId: number, enabled: boolean) {
    return useQuery({
        queryKey: ['quarantine-playlist-items', playlistId],
        enabled,
        queryFn: async () => {
            const { data } = await api.get(`/quarantine/playlists/${playlistId}/items`);
            return data as PlaylistItem[];
        },
    });
}

export function useImportJobStatus(importId?: string) {
    return useQuery({
        queryKey: ['quarantine-import', importId],
        enabled: Boolean(importId),
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === 'queued' || status === 'running' ? 2000 : false;
        },
        queryFn: async () => {
            const { data } = await api.get(`/quarantine/imports/${importId}`);
            return data as QuarantineImportJob;
        },
    });
}
