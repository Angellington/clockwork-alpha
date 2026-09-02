import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import { DeleteSweep, DoneAll, Undo } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';

import { quarantineStyles } from '../../../styles/Quarantine.styles';
import { confirmToast } from '../../../utils/confirmToast';
import type { QuarantineItem } from '../hooks/useQuarantine';

type Bucket = 'quarantine' | 'watched' | 'delete';

interface PoemsOfMachineProps {
    open: boolean;
    items: QuarantineItem[];
    allVideos: QuarantineItem[];
    marking: boolean;
    deleting: boolean;
    onClose: () => void;
    onDeleteBatch: (videoIds: number[]) => void;
    onMarkWatchedBatch: (videoIds: number[]) => void;
}

function bucketTitle(bucket: Bucket) {
    if (bucket === 'watched') {
        return 'Assistido';
    }

    if (bucket === 'delete') {
        return 'Excluir';
    }

    return 'Quarentena';
}

export default function PoemsOfMachine({
    deleting,
    items,
    allVideos,
    marking,
    onClose,
    onDeleteBatch,
    onMarkWatchedBatch,
    open,
}: PoemsOfMachineProps) {
    const videos = useMemo(
        () => (allVideos.length > 0 ? allVideos : items).filter((item) => item.item_type === 'video'),
        [allVideos, items],
    );
    const [buckets, setBuckets] = useState<Record<Bucket, number[]>>({
        quarantine: [],
        watched: [],
        delete: [],
    });

    useEffect(() => {
        if (open) {
            setBuckets({
                quarantine: videos.map((video) => video.id),
                watched: [],
                delete: [],
            });
        }
    }, [open, videos]);

    const byId = useMemo(() => new Map(videos.map((video) => [video.id, video])), [videos]);

    const moveVideo = (videoId: number, target: Bucket) => {
        setBuckets((current) => {
            const next: Record<Bucket, number[]> = {
                quarantine: current.quarantine.filter((id) => id !== videoId),
                watched: current.watched.filter((id) => id !== videoId),
                delete: current.delete.filter((id) => id !== videoId),
            };
            next[target] = [...next[target], videoId];
            return next;
        });
    };

    const renderBucket = (bucket: Bucket) => (
        <Box
            sx={{
                ...quarantineStyles.poemsBucket,
                ...(bucket === 'delete' ? quarantineStyles.poemsDangerBucket : {}),
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
                const videoId = Number(event.dataTransfer.getData('text/plain'));
                if (videoId) {
                    moveVideo(videoId, bucket);
                }
            }}
        >
            <Box sx={quarantineStyles.poemsBucketHeader}>
                <Typography sx={quarantineStyles.itemTitle}>{bucketTitle(bucket)}</Typography>
                <Typography variant="body2" sx={quarantineStyles.metaLine}>
                    {buckets[bucket].length} videos
                </Typography>
            </Box>

            <Box sx={quarantineStyles.poemsThumbGrid}>
                {buckets[bucket].map((videoId) => {
                    const video = byId.get(videoId);
                    if (!video) {
                        return null;
                    }

                    return (
                        <Box
                            key={videoId}
                            draggable
                            title={video.title}
                            onDragStart={(event) => event.dataTransfer.setData('text/plain', String(videoId))}
                            sx={quarantineStyles.poemsThumb}
                        >
                            {video.thumbnail_url ? (
                                <Box
                                    component="img"
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    sx={quarantineStyles.thumbnailImage}
                                />
                            ) : (
                                <Typography variant="caption">{video.title}</Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>

            {bucket === 'watched' && (
                <Button
                    fullWidth
                    startIcon={<DoneAll />}
                    disabled={buckets.watched.length === 0 || marking}
                    onClick={() => onMarkWatchedBatch(buckets.watched)}
                    sx={quarantineStyles.primaryButton}
                >
                    Marcar assistidos
                </Button>
            )}

            {bucket === 'delete' && (
                <Button
                    fullWidth
                    startIcon={<DeleteSweep />}
                    disabled={buckets.delete.length === 0 || deleting}
                    onClick={() => {
                        confirmToast({
                            title: `Excluir ${buckets.delete.length} videos?`,
                            description: 'Os videos selecionados serao removidos definitivamente da quarentena.',
                            destructive: true,
                            onConfirm: () => onDeleteBatch(buckets.delete),
                        });
                    }}
                    sx={quarantineStyles.dangerButton}
                >
                    Excluir selecionados
                </Button>
            )}

            {bucket === 'quarantine' && (
                <Button
                    fullWidth
                    startIcon={<Undo />}
                    disabled
                    sx={quarantineStyles.secondaryButton}
                >
                    Origem
                </Button>
            )}
        </Box>
    );

    return (
        <Dialog
            fullWidth
            maxWidth="lg"
            open={open}
            onClose={onClose}
            slotProps={{ paper: { sx: quarantineStyles.dialogPaper } }}
        >
            <DialogTitle>Poems of Machine</DialogTitle>
            <DialogContent>
                <Box sx={quarantineStyles.poemsGrid}>
                    {renderBucket('quarantine')}
                    {renderBucket('watched')}
                    {renderBucket('delete')}
                </Box>
            </DialogContent>
            <DialogActions sx={quarantineStyles.dialogActions}>
                <Button onClick={onClose} sx={quarantineStyles.secondaryButton}>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
