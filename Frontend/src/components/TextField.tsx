import {
    Box,
    Button,
    TextField as MuiTextField,
    type TextFieldProps,
} from '@mui/material';
import { purple } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface FormTextFieldProps<T extends FieldValues>
    extends Omit<TextFieldProps, 'name'> {
    name: Path<T>;
    control: Control<T>;
}

export default function TextField<T extends FieldValues>({
    name,
    control,
    ...props
}: FormTextFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <MuiTextField
                    {...field}
                    {...props}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
}

interface SearchTextFieldProps<T extends FieldValues>
    extends Omit<TextFieldProps, 'name'> {
    name: Path<T>;
    control: Control<T>;
    buttonLabel?: string;
    loading?: boolean;
}

export function SearchTextField<T extends FieldValues>({
    name,
    control,
    buttonLabel = 'Search',
    loading = false,
    disabled,
    ...props
}: SearchTextFieldProps<T>) {
    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'stretch',
                flexDirection: {
                    xs: 'column',
                    sm: 'row',
                },
            }}
        >
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <MuiTextField
                        {...field}
                        {...props}
                        size='medium'
                        disabled={disabled || loading}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={{
                            flex: 1,

                            '& .MuiOutlinedInput-root': {
                                borderRadius: {
                                    xs: '10px 10px 0 0',
                                    sm: '10px 0 0 10px',
                                },

                                '& fieldset': {
                                    borderColor: purple[500],
                                },

                                '&:hover fieldset': {
                                    borderColor: purple[700],
                                },

                                '&.Mui-focused fieldset': {
                                    borderColor: purple[600],
                                },
                            },
                            ...props.sx,
                        }}
                    />
                )}
            />

            <Button
                type="submit"
                variant="outlined"
                disabled={disabled || loading}
                startIcon={<SearchIcon />}
                sx={{
                    minWidth: {
                        xs: '100%',
                        sm: 120,
                    },
                    minHeight: 56,
                    borderRadius: {
                        xs: '0 0 10px 10px',
                        sm: '0 10px 10px 0',
                    },
                    borderColor: purple[600],
                    boxShadow: 'none',
                    marginLeft: {
                        xs: 0,
                        sm: '-1px',
                    },
                    marginTop: {
                        xs: '-1px',
                        sm: 0,
                    },
                    '&:hover': {
                        backgroundColor: purple[700],
                        boxShadow: 'none',
                        color: 'white',
                    },
                    color: purple[600]
                }}
            >
                {buttonLabel}
            </Button>
        </Box>
    );
}
