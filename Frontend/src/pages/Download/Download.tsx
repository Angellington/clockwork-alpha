import { useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';

import Resource from '../../components/Resource';
import { SearchTextField } from '../../components/TextField';
import { useYoutube, type YoutubeAudioStream, type YoutubeVideoStream } from '../../hooks/useYoutube';
import { TitleContainer } from './Components/Title';
import GlassContainer from '../../components/GlassContainer';

interface DownloadForm {
    url: string;
    resolution: string;
}

const DESCRIPTION_LIMIT = 180;

function formatDuration(duration?: number) {
    if (!duration) {
        return '--:--';
    }

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function compactDescription(description?: string) {
    if (!description) {
        return 'Descricao indisponivel para este video.';
    }

    if (description.length <= DESCRIPTION_LIMIT) {
        return description;
    }

    return `${description.slice(0, DESCRIPTION_LIMIT).trim()}...`;
}

function uniqueVideoStreams(streams: YoutubeVideoStream[]) {
    const seen = new Set<string>();

    return streams.filter((stream) => {
        const key = stream.resolution ?? String(stream.itag);

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function sortVideoStreams(streams: YoutubeVideoStream[]) {
    return [...streams].sort((a, b) => {
        const aHeight = Number.parseInt(a.resolution ?? '0', 10);
        const bHeight = Number.parseInt(b.resolution ?? '0', 10);

        return aHeight - bHeight;
    });
}

function formatAudioLabel(stream: YoutubeAudioStream) {
    if (stream.abr) {
        const abr = String(stream.abr);
        return abr.toLowerCase().includes('kbps') ? abr : `${abr}kbps`;
    }

    return stream.audioCodec ?? 'audio';
}

function FormatButton({
    children,
    disabled,
    loading,
    onClick,
}: {
    children: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
}) {
    return (
        <Button
            size="small"
            variant="outlined"
            startIcon={loading ? <CircularProgress size={14} /> : <DownloadIcon />}
            disabled={disabled || loading}
            onClick={onClick}
            sx={{
                minWidth: 104,
                borderColor: 'rgba(255,255,255,0.28)',
                color: 'rgba(255,255,255,0.92)',
                textTransform: 'none',
                '&:hover': {
                    borderColor: '#8BD3DD',
                    backgroundColor: 'rgba(139,211,221,0.12)',
                },
            }}
        >
            {children}
        </Button>
    );
}

function FormatRow({
    icon,
    title,
    subtitle,
    children,
}: {
    icon: ReactNode;
    title: string;
    subtitle: string;
    children: ReactNode;
}) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    md: '190px 1fr',
                },
                gap: 2,
                alignItems: 'start',
                py: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                }}
            >
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: 'rgba(139,211,221,0.16)',
                        color: '#8BD3DD',
                    }}
                >
                    {icon}
                </Box>

                <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 700 }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.58)' }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default function Download() {
    const { control, handleSubmit } = useForm<DownloadForm>({
        defaultValues: {
            url: '',
            resolution: ' ',
        },
    });

    const { downloadingResolution, downloadVideo, fetchData, loading, error, videoInfo } = useYoutube();
    const [submittedUrl, setSubmittedUrl] = useState('');
    const [descriptionOpen, setDescriptionOpen] = useState(false);

    const videoStreams = useMemo(
        () => sortVideoStreams(uniqueVideoStreams(videoInfo?.resolutions.video ?? [])),
        [videoInfo]
    );
    const audioStreams = videoInfo?.resolutions.audio ?? [];
    const showMoreDescription = Boolean(
        videoInfo?.description && videoInfo.description.length > DESCRIPTION_LIMIT
    );

    const onSubmit = (data: DownloadForm) => {
        setSubmittedUrl(data.url);
        fetchData.mutate(data.url);
    }

    const handleDownload = (resolution: string) => {
        downloadVideo.mutate({
            url: submittedUrl,
            resolution,
        });
    }

    return (
        <Resource>
            <TitleContainer>
                <Typography>Clockwork Alpha Youtube Finder</Typography>
            </TitleContainer>

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1120,
                    px: {
                        xs: 2,
                        md: 3,
                    },
                }}
            >
                <GlassContainer
                    maxWidth={false}
                    sx={{
                        width: '100%',
                        px: {
                            xs: 2,
                            sm: 4,
                        },
                        py: {
                            xs: 3,
                            sm: 4,
                        },
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <SearchTextField
                            name="url"
                            control={control}
                            loading={loading}
                            label="URL"
                            fullWidth
                        />

                        {loading && (
                            <Box
                                sx={{
                                    minHeight: 156,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                }}
                            >
                                <CircularProgress />
                                <Typography variant="body2" color="text.secondary">
                                    Buscando informacoes do video...
                                </Typography>
                            </Box>
                        )}

                        {!loading && error && (
                            <Box
                                sx={{
                                    border: '1px solid rgba(211,47,47,0.35)',
                                    backgroundColor: 'rgba(211,47,47,0.08)',
                                    borderRadius: '8px',
                                    p: 2,
                                }}
                            >
                                <Typography color="error" variant="body2">
                                    {error}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </GlassContainer>

                {!loading && videoInfo && (
                    <Box
                        sx={{
                            position: 'relative',
                            mt: 3,
                            overflow: 'hidden',
                            borderRadius: '12px',
                            '@keyframes stripeIn': {
                                '0%': {
                                    transform: 'translateX(-110%)',
                                },
                                '100%': {
                                    transform: 'translateX(0)',
                                },
                            },
                            '@keyframes contentIn': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateY(16px)',
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                width: {
                                    xs: '38%',
                                    md: '25%',
                                },
                                backgroundColor: 'rgba(0,0,0,0.46)',
                                animation: 'stripeIn 560ms ease-out both',
                                pointerEvents: 'none',
                            }}
                        />

                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                animation: 'contentIn 420ms ease-out 160ms both',
                            }}
                        >
                            <Box
                                sx={{
                                    minHeight: 245,
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: '360px 1fr',
                                    },
                                    gap: 3,
                                    p: {
                                        xs: 2,
                                        md: 3,
                                    },
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(7,11,17,0.76)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        aspectRatio: '16 / 9',
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        backgroundColor: '#080A0F',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={videoInfo.thumbnail}
                                        alt={videoInfo.title ?? 'Video thumbnail'}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'block',
                                            objectFit: 'cover',
                                        }}
                                    />

                                    <Chip
                                        icon={<AccessTimeIcon />}
                                        label={formatDuration(videoInfo.duration)}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            right: 10,
                                            bottom: 10,
                                            height: 28,
                                            backgroundColor: 'rgba(0,0,0,0.82)',
                                            color: '#fff',
                                            '& .MuiChip-icon': {
                                                color: '#fff',
                                            },
                                        }}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        gap: 1.75,
                                    }}
                                >
                                    <Chip
                                        label={`Fonte: ${videoInfo.resolutions.provider ?? 'youtube'}`}
                                        size="small"
                                        sx={{
                                            alignSelf: 'flex-start',
                                            backgroundColor: 'rgba(139,211,221,0.14)',
                                            color: '#8BD3DD',
                                            borderRadius: '6px',
                                        }}
                                    />

                                    <Typography
                                        component="h2"
                                        sx={{
                                            color: '#fff',
                                            fontSize: {
                                                xs: 24,
                                                md: 32,
                                            },
                                            lineHeight: 1.12,
                                            fontWeight: 800,
                                        }}
                                    >
                                        {videoInfo.title ?? 'Titulo indisponivel'}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255,255,255,0.72)',
                                            whiteSpace: 'pre-line',
                                            lineHeight: 1.65,
                                        }}
                                    >
                                        {compactDescription(videoInfo.description)}
                                    </Typography>

                                    {showMoreDescription && (
                                        <Button
                                            size="small"
                                            onClick={() => setDescriptionOpen(true)}
                                            sx={{
                                                alignSelf: 'flex-start',
                                                color: '#8BD3DD',
                                                textTransform: 'none',
                                                px: 0,
                                            }}
                                        >
                                            Mostrar mais
                                        </Button>
                                    )}
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    minHeight: {
                                        xs: 420,
                                        md: 612,
                                    },
                                    p: {
                                        xs: 2,
                                        md: 3,
                                    },
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(7,11,17,0.82)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 800,
                                        fontSize: 22,
                                        mb: 1,
                                    }}
                                >
                                    Formatos disponiveis
                                </Typography>

                                <FormatRow
                                    icon={<MovieIcon />}
                                    title="MP4"
                                    subtitle="Video"
                                >
                                    {videoStreams.map((stream) => {
                                        const resolution = stream.resolution ?? String(stream.itag);
                                        const isDownloading = downloadingResolution === resolution;

                                        return (
                                            <FormatButton
                                                key={`${stream.itag}-${resolution}`}
                                                loading={isDownloading}
                                                onClick={() => handleDownload(resolution)}
                                            >
                                                {resolution}
                                            </FormatButton>
                                        );
                                    })}

                                    <FormatButton
                                        loading={downloadingResolution === '1080p'}
                                        onClick={() => handleDownload('1080p')}
                                    >
                                        1080p audio
                                    </FormatButton>
                                </FormatRow>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)' }} />

                                <FormatRow
                                    icon={<AudiotrackIcon />}
                                    title="MP3"
                                    subtitle="Audio"
                                >
                                    {audioStreams.map((stream: YoutubeAudioStream) => (
                                        <FormatButton
                                            key={`${stream.itag}-${stream.abr}`}
                                            disabled
                                        >
                                            {formatAudioLabel(stream)}
                                        </FormatButton>
                                    ))}
                                </FormatRow>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)' }} />

                                <FormatRow
                                    icon={<ImageIcon />}
                                    title="Thumbnail"
                                    subtitle="Imagem"
                                >
                                    <Button
                                        component="a"
                                        href={videoInfo.thumbnail}
                                        target="_blank"
                                        rel="noreferrer"
                                        size="small"
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        sx={{
                                            minWidth: 132,
                                            borderColor: 'rgba(255,255,255,0.28)',
                                            color: 'rgba(255,255,255,0.92)',
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: '#8BD3DD',
                                                backgroundColor: 'rgba(139,211,221,0.12)',
                                            },
                                        }}
                                    >
                                        Abrir imagem
                                    </Button>
                                </FormatRow>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>

            <Dialog
                open={descriptionOpen}
                onClose={() => setDescriptionOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    Descricao
                    <Button
                        onClick={() => setDescriptionOpen(false)}
                        startIcon={<CloseIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Fechar
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                        {videoInfo?.description}
                    </Typography>
                </DialogContent>
            </Dialog>
        </Resource>
    );
}
