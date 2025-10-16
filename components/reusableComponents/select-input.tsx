// components/global-select.tsx
'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Option = {
    label: string
    value: string
}

interface GlobalSelectProps {
    options: Option[]
    value: string
    onChange: (key: string, value: string) => void
    placeholder?: string
}

export function SelectInput({
    options,
    value,
    onChange,
    placeholder = "Select an option",
}: GlobalSelectProps) {
    return (
        <Select value={value} onValueChange={(e) => onChange("country", e)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
