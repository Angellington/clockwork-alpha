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
import { downloadStyles } from '../../styles/Download.styles';

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
    featured,
    loading,
    onClick,
}: {
    children: ReactNode;
    disabled?: boolean;
    featured?: boolean;
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
            sx={featured ? downloadStyles.featuredButton : downloadStyles.formatButton}
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
        <Box sx={downloadStyles.formatRow}>
            <Box sx={downloadStyles.formatRowLabel}>
                <Box sx={downloadStyles.formatIcon}>{icon}</Box>

                <Box>
                    <Typography sx={downloadStyles.formatTitle}>{title}</Typography>
                    <Typography variant="caption" sx={downloadStyles.formatSubtitle}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>

            <Box sx={downloadStyles.formatActions}>{children}</Box>
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
    const regularVideoStreams = videoStreams.filter((stream) => stream.resolution !== '1080p');
    const audioStreams = videoInfo?.resolutions.audio ?? [];
    const showMoreDescription = Boolean(
        videoInfo?.description && videoInfo.description.length > DESCRIPTION_LIMIT
    );
    const hasVideo = Boolean(videoInfo && !loading);

    const onSubmit = (data: DownloadForm) => {
        setSubmittedUrl(data.url);
        fetchData.mutate(data.url);
    };

    const handleDownload = (resolution: string) => {
        downloadVideo.mutate({
            url: submittedUrl,
            resolution,
        });
    };

    const searchForm = (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={downloadStyles.form}>
            <SearchTextField
                name="url"
                control={control}
                loading={loading}
                label="URL"
                fullWidth
                buttonLabel={hasVideo ? 'Consultar' : 'Search'}
            />

            {loading && (
                <Box sx={downloadStyles.loading}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary">
                        Buscando informacoes do video...
                    </Typography>
                </Box>
            )}

            {!loading && error && (
                <Box sx={downloadStyles.error}>
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                </Box>
            )}
        </Box>
    );

    return (
        <Resource>
            <Box sx={downloadStyles.route(hasVideo)}>
                {!hasVideo && (
                    <TitleContainer>
                        <Typography>Clockwork Alpha Youtube Finder</Typography>
                    </TitleContainer>
                )}

                <Box sx={downloadStyles.content(hasVideo)}>
                    {!hasVideo && (
                        <GlassContainer maxWidth={false} sx={downloadStyles.initialCard}>
                            {searchForm}
                        </GlassContainer>
                    )}

                    {hasVideo && videoInfo && (
                        <Box sx={downloadStyles.result}>
                            <Box sx={downloadStyles.videoCard}>
                                <Box sx={downloadStyles.thumbnail}>
                                    <Box
                                        component="img"
                                        src={videoInfo.thumbnail}
                                        alt={videoInfo.title ?? 'Video thumbnail'}
                                        sx={downloadStyles.thumbnailImage}
                                    />

                                    <Chip
                                        icon={<AccessTimeIcon />}
                                        label={formatDuration(videoInfo.duration)}
                                        size="small"
                                        sx={downloadStyles.durationChip}
                                    />
                                </Box>

                                <Box sx={downloadStyles.videoMeta}>
                                    <Chip
                                        label={`Fonte: ${videoInfo.resolutions.provider ?? 'youtube'}`}
                                        size="small"
                                        sx={downloadStyles.providerChip}
                                    />

                                    <Typography component="h2" sx={downloadStyles.videoTitle}>
                                        {videoInfo.title ?? 'Titulo indisponivel'}
                                    </Typography>

                                    <Typography variant="body2" sx={downloadStyles.description}>
                                        {compactDescription(videoInfo.description)}
                                    </Typography>

                                    {showMoreDescription && (
                                        <Button
                                            size="small"
                                            onClick={() => setDescriptionOpen(true)}
                                            sx={downloadStyles.textButton}
                                        >
                                            Mostrar mais
                                        </Button>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={downloadStyles.formatsCard}>
                                <Box sx={downloadStyles.formatsHeader}>
                                    <Typography sx={downloadStyles.sectionTitle}>
                                        Formatos disponiveis
                                    </Typography>

                                    <Box sx={downloadStyles.embeddedSearch}>{searchForm}</Box>
                                </Box>

                                <FormatRow icon={<MovieIcon />} title="MP4" subtitle="Video">
                                    {regularVideoStreams.map((stream) => {
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
                                </FormatRow>

                                <Divider />

                                <Box sx={downloadStyles.featuredRow}>
                                    <Box sx={downloadStyles.formatRowLabel}>
                                        <Box sx={downloadStyles.formatIcon}>
                                            <MovieIcon />
                                        </Box>
                                        <Box>
                                            <Typography sx={downloadStyles.formatTitle}>
                                                1080p audio
                                            </Typography>
                                            <Typography variant="caption" sx={downloadStyles.formatSubtitle}>
                                                Opcao unica com video e audio
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <FormatButton
                                        featured
                                        loading={downloadingResolution === '1080p'}
                                        onClick={() => handleDownload('1080p')}
                                    >
                                        Baixar 1080p audio
                                    </FormatButton>
                                </Box>

                                <Divider />

                                <FormatRow icon={<AudiotrackIcon />} title="MP3" subtitle="Audio">
                                    {audioStreams.map((stream: YoutubeAudioStream) => (
                                        <FormatButton key={`${stream.itag}-${stream.abr}`} disabled>
                                            {formatAudioLabel(stream)}
                                        </FormatButton>
                                    ))}
                                </FormatRow>

                                <Divider />

                                <FormatRow icon={<ImageIcon />} title="Thumbnail" subtitle="Imagem">
                                    <Button
                                        component="a"
                                        href={videoInfo.thumbnail}
                                        target="_blank"
                                        rel="noreferrer"
                                        size="small"
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        sx={downloadStyles.formatButton}
                                    >
                                        Abrir imagem
                                    </Button>
                                </FormatRow>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            <Dialog
                open={descriptionOpen}
                onClose={() => setDescriptionOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={downloadStyles.dialogTitle}>
                    Descricao
                    <Button
                        onClick={() => setDescriptionOpen(false)}
                        startIcon={<CloseIcon />}
                        sx={downloadStyles.dialogCloseButton}
                    >
                        Fechar
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={downloadStyles.dialogDescription}>
                        {videoInfo?.description}
                    </Typography>
                </DialogContent>
            </Dialog>
        </Resource>
    );
}
