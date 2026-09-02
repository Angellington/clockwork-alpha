import { Box, Button, Typography } from '@mui/material';
import { toast } from 'sonner';

interface ConfirmToastOptions {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    onConfirm: () => void;
}

export function confirmToast({
    cancelText = 'Nao',
    confirmText = 'Sim',
    description,
    destructive,
    onConfirm,
    title,
}: ConfirmToastOptions) {
    toast.custom((toastId) => (
        <Box
            sx={{
                width: 320,
                display: 'grid',
                gap: 1.25,
                p: 1.5,
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: '#0D1414',
                color: '#E8EDF0',
                boxShadow: '0 18px 42px rgba(0,0,0,0.34)',
            }}
        >
            <Box>
                <Typography sx={{ fontWeight: 800, lineHeight: 1.25 }}>
                    {title}
                </Typography>
                {description && (
                    <Typography
                        variant="body2"
                        sx={{ mt: 0.5, color: 'rgba(232,237,240,0.68)', lineHeight: 1.45 }}
                    >
                        {description}
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                    size="small"
                    onClick={() => toast.dismiss(toastId)}
                    sx={{
                        minHeight: 34,
                        borderRadius: 1.5,
                        color: '#E8EDF0',
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                        toast.dismiss(toastId);
                        onConfirm();
                    }}
                    sx={{
                        minHeight: 34,
                        borderRadius: 1.5,
                        backgroundColor: destructive ? '#D76D6D' : '#7AD7C4',
                        color: destructive ? '#170707' : '#06100F',
                        fontWeight: 800,
                        '&:hover': {
                            backgroundColor: destructive ? '#F09595' : '#A0E6D8',
                        },
                    }}
                >
                    {confirmText}
                </Button>
            </Box>
        </Box>
    ));
}
