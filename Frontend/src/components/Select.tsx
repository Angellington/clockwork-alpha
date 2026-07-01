import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { Controller } from "react-hook-form";

interface SelectOption {
    id: string | number;
    value: string;
}

interface SelectItemProps extends Omit< "name"> {
    name: string;
    label?: string;
    control: any;
    items: SelectOption[];
}

export default function SelectItem({
    name,
    label,
    control,
    items,
    ...props
}: SelectItemProps) {
    return (
        <FormControl fullWidth>
            {label && <InputLabel>{label}</InputLabel>}

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label={label}
                        {...props}
                    >
                        {items.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.value}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            />
        </FormControl>
    );
}