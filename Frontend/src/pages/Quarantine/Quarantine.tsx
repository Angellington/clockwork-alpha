import {
    Box,
    Button,
    CircularProgress,
    LinearProgress,
    Typography,
} from '@mui/material';
import { Add, AutoFixHigh } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { quarantineStyles } from '../../styles/Quarantine.styles';
import AddVideoDialog from './components/AddVideoDialog';
import PoemsOfMachine from './components/PoemsOfMachine';
import QuarantineCard from './components/QuarantineCard';
import PlaylistAccordion from './components/PlaylistAccordion';
import { useImportJobStatus, useQuarantine, type QuarantineImportJob, type QuarantineItem } from './hooks/useQuarantine';

export default function Quarantine() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [poemsOpen, setPoemsOpen] = useState(false);
    const [markingVideoId, setMarkingVideoId] = useState<number>();
    const [deletingItemKey, setDeletingItemKey] = useState<string>();
    const [removingItemId, setRemovingItemId] = useState<number>();
    const [importJobId, setImportJobId] = useState<string>();
    const {
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
    } = useQuarantine();
    const importJobQuery = useImportJobStatus(importJobId);
    const importJob = importJobQuery.data;

    useEffect(() => {
        if (importJob?.status === 'completed') {
            query.refetch();
        }
    }, [importJob?.status]);

    const handleImportStarted = (job: QuarantineImportJob) => {
        setImportJobId(job.id);
    };

    const handleMarkWatched = (videoId: number) => {
        setMarkingVideoId(videoId);
        markWatched.mutate(videoId, {
            onSettled: () => setMarkingVideoId(undefined),
        });
    };

    const handleDeleteItem = (item: QuarantineItem) => {
        if (!window.confirm(`Excluir "${item.title}" definitivamente da quarentena?`)) {
            return;
        }

        const key = `${item.item_type}-${item.id}`;
        setDeletingItemKey(key);

        if (item.item_type === 'video') {
            deleteVideo.mutate(item.id, {
                onSettled: () => setDeletingItemKey(undefined),
            });
            return;
        }

        deletePlaylist.mutate(item.id, {
            onSettled: () => setDeletingItemKey(undefined),
        });
    };

    const handleRemovePlaylistItem = (itemId: number) => {
        setRemovingItemId(itemId);
        removePlaylistItem.mutate(itemId, {
            onSettled: () => setRemovingItemId(undefined),
        });
    };

    const handleMarkWatchedBatch = (videoIds: number[]) => {
        markWatchedBatch.mutate(videoIds, {
            onSuccess: () => setPoemsOpen(false),
        });
    };

    const handleDeleteBatch = (videoIds: number[]) => {
        deleteVideosBatch.mutate(videoIds, {
            onSuccess: () => setPoemsOpen(false),
        });
    };

    const importProgress = importJob?.total_videos
        ? Math.round((importJob.processed_videos / importJob.total_videos) * 100)
        : 0;

    return (
        <Box sx={quarantineStyles.route}>
            <Box sx={quarantineStyles.shell}>
                <Box sx={quarantineStyles.header}>
                    <Box>
                        <Typography component="h1" sx={quarantineStyles.title}>
                            Quarantine
                        </Typography>
                        <Typography sx={quarantineStyles.subtitle}>
                            Biblioteca local para videos de estudo, organizada fora do fluxo do YouTube.
                        </Typography>
                    </Box>

                    <Box sx={quarantineStyles.actions}>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            sx={quarantineStyles.primaryButton}
                            onClick={() => setDialogOpen(true)}
                        >
                            Colocar video em quarentena
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<AutoFixHigh />}
                            sx={quarantineStyles.secondaryButton}
                            onClick={() => setPoemsOpen(true)}
                        >
                            Poems of Machine
                        </Button>
                    </Box>
                </Box>

                {importJob && (
                    <Box sx={quarantineStyles.importStatus}>
                        <Box sx={quarantineStyles.poemsBucketHeader}>
                            <Typography sx={quarantineStyles.itemTitle}>Importacao de playlist</Typography>
                            <Typography variant="body2" sx={quarantineStyles.metaLine}>
                                {importJob.status} - {importJob.processed_videos}/{importJob.total_videos} videos
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={importProgress} />
                        {importJob.cancel_reason && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {importJob.cancel_reason}
                            </Typography>
                        )}
                    </Box>
                )}

                {query.isLoading && (
                    <Box sx={quarantineStyles.empty}>
                        <CircularProgress />
                    </Box>
                )}

                {query.isError && (
                    <Box sx={quarantineStyles.empty}>
                        <Typography color="error">
                            Nao foi possivel carregar a quarentena.
                        </Typography>
                    </Box>
                )}

                {query.data && query.data.items.length === 0 && (
                    <Box sx={quarantineStyles.empty}>
                        <Typography>Nenhum video ou playlist em quarentena.</Typography>
                    </Box>
                )}

                <Box sx={quarantineStyles.list}>
                    {query.data?.items.map((item) => {
                        if (item.item_type === 'playlist') {
                            return (
                                <PlaylistAccordion
                                    key={`${item.item_type}-${item.id}`}
                                    item={item}
                                    deletingItemKey={deletingItemKey}
                                    markingVideoId={markingVideoId}
                                    removingItemId={removingItemId}
                                    onDeleteItem={handleDeleteItem}
                                    onMarkWatched={handleMarkWatched}
                                    onRemovePlaylistItem={handleRemovePlaylistItem}
                                />
                            );
                        }

                        return (
                            <QuarantineCard
                                key={`${item.item_type}-${item.id}`}
                                item={item}
                                deleting={deletingItemKey === `${item.item_type}-${item.id}`}
                                loading={markingVideoId === item.id}
                                onDelete={() => handleDeleteItem(item)}
                                onMarkWatched={() => handleMarkWatched(item.id)}
                            />
                        );
                    })}
                </Box>
            </Box>

            <AddVideoDialog
                open={dialogOpen}
                addVideo={addVideo}
                previewUrl={previewUrl}
                startPlaylistImport={startPlaylistImport}
                onClose={() => setDialogOpen(false)}
                onImportStarted={handleImportStarted}
            />

            <PoemsOfMachine
                open={poemsOpen}
                items={query.data?.items ?? []}
                deleting={deleteVideosBatch.isPending}
                marking={markWatchedBatch.isPending}
                onClose={() => setPoemsOpen(false)}
                onDeleteBatch={handleDeleteBatch}
                onMarkWatchedBatch={handleMarkWatchedBatch}
            />
        </Box>
    );
}
