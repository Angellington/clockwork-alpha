import {
    Box,
    Button,
    TextField as MuiTextField,
    type TextFieldProps,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { searchTextFieldStyles } from '../styles/components.styles';

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
        <Box sx={searchTextFieldStyles.root}>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <MuiTextField
                        {...field}
                        {...props}
                        size="medium"
                        disabled={disabled || loading}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={[searchTextFieldStyles.input, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
                    />
                )}
            />

            <Button
                type="submit"
                variant="outlined"
                disabled={disabled || loading}
                startIcon={<SearchIcon />}
                sx={searchTextFieldStyles.button}
            >
                {buttonLabel}
            </Button>
        </Box>
    );
}
