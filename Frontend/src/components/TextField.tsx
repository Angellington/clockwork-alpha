import {
    TextField as MuiTextField,
    type TextFieldProps,
} from '@mui/material';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import type { Path } from 'react-router';

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