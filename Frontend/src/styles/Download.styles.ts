import type { SxProps, Theme } from '@mui/material/styles';

const panelBase = {
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.84)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
};

export const downloadStyles = {
    route: (active: boolean): SxProps<Theme> => ({
        position: 'relative',
        width: '100%',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: {
            xs: 2,
            md: 2.25,
        },
        px: {
            xs: 2,
            md: 3,
        },
        py: {
            xs: 7,
            md: 3,
        },
        overflow: 'hidden',
        background: 'transparent',
        '@keyframes downloadStripeIn': {
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
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: {
                xs: '42%',
                md: '25%',
            },
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.58)',
            opacity: active ? 1 : 0,
            animation: active ? 'downloadStripeIn 560ms ease-out both' : 'none',
            pointerEvents: 'none',
            zIndex: 1,
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.08)',
            pointerEvents: 'none',
            zIndex: 0,
        },
    }),
    content: (active: boolean): SxProps<Theme> => ({
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 1040,
        height: active
            ? {
                  xs: 'calc(100dvh - 112px)',
                  md: 'calc(100dvh - 48px)',
              }
            : 'auto',
        overflow: 'hidden',
    }),
    initialCard: {
        width: '100%',
        px: {
            xs: 2,
            sm: 4,
        },
        py: {
            xs: 3,
            sm: 4,
        },
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    loading: {
        minHeight: 156,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 1.5,
    },
    error: {
        border: '1px solid rgba(211,47,47,0.35)',
        backgroundColor: 'rgba(211,47,47,0.08)',
        borderRadius: '8px',
        p: 2,
    },
    result: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        minHeight: 0,
        animation: 'contentIn 420ms ease-out 160ms both',
    },
    videoCard: {
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: {
            xs: 'minmax(0, 260px)',
            md: '280px 1fr',
        },
        justifyContent: {
            xs: 'center',
            md: 'stretch',
        },
        gap: 2,
        p: {
            xs: 1.5,
            md: 2,
        },
        ...panelBase,
    },
    thumbnail: {
        position: 'relative',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#080A0F',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        display: 'block',
        objectFit: 'cover',
    },
    durationChip: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        height: 28,
        backgroundColor: 'rgba(0,0,0,0.82)',
        color: '#fff',
        '& .MuiChip-icon': {
            color: '#fff',
        },
    },
    videoMeta: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1.15,
    },
    providerChip: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(156,39,176,0.16)',
        color: '#CE93D8',
        borderRadius: '6px',
    },
    videoTitle: {
        color: '#fff',
        fontSize: {
            xs: 20,
            md: 26,
        },
        lineHeight: 1.12,
        fontWeight: 800,
    },
    description: {
        color: 'rgba(255,255,255,0.72)',
        whiteSpace: 'pre-line',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    textButton: {
        alignSelf: 'flex-start',
        color: '#CE93D8',
        textTransform: 'none',
        px: 0,
    },
    formatsCard: {
        minHeight: 0,
        flex: 1,
        overflowY: 'auto',
        p: {
            xs: 1.5,
            md: 2,
        },
        ...panelBase,
    },
    formatsHeader: {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            md: 'row',
        },
        alignItems: {
            xs: 'stretch',
            md: 'center',
        },
        justifyContent: 'space-between',
        gap: 1.5,
        mb: 1,
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 800,
        fontSize: 20,
    },
    embeddedSearch: {
        width: {
            xs: '100%',
            md: 440,
        },
    },
    formatRow: {
        display: 'grid',
        gridTemplateColumns: {
            xs: '1fr',
            md: '190px 1fr',
        },
        gap: 1.5,
        alignItems: 'start',
        py: 1.35,
    },
    formatRowLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
    },
    formatIcon: {
        width: 38,
        height: 38,
        borderRadius: '8px',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'rgba(156,39,176,0.16)',
        color: '#CE93D8',
    },
    formatTitle: {
        color: '#fff',
        fontWeight: 700,
    },
    formatSubtitle: {
        color: 'rgba(255,255,255,0.58)',
    },
    formatActions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
    },
    formatButton: {
        minWidth: 104,
        borderColor: 'rgba(255,255,255,0.28)',
        color: 'rgba(255,255,255,0.92)',
        textTransform: 'none',
        '&:hover': {
            borderColor: '#9C27B0',
            backgroundColor: 'rgba(156,39,176,0.14)',
        },
    },
    featuredButton: {
        minWidth: 172,
        borderColor: 'rgba(247,200,115,0.72)',
        color: '#FFE0A3',
        backgroundColor: 'rgba(247,200,115,0.10)',
        textTransform: 'none',
        '&:hover': {
            borderColor: '#F7C873',
            backgroundColor: 'rgba(247,200,115,0.18)',
        },
    },
    featuredRow: {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            sm: 'row',
        },
        alignItems: {
            xs: 'flex-start',
            sm: 'center',
        },
        justifyContent: 'space-between',
        gap: 1.5,
        py: 1.35,
    },
    dialogTitle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
    },
    dialogDescription: {
        whiteSpace: 'pre-line',
        lineHeight: 1.7,
    },
    dialogCloseButton: {
        textTransform: 'none',
    },
};
