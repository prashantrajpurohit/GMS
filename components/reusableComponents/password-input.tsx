// components/password-input.tsx
'use client'

import { ChangeEvent, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface GlobalPasswordInputProps {
    value: string
    onChange: (key: string, value: string) => void
    placeholder?: string
}


export function PasswordInput({ onChange, value, placeholder }: GlobalPasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => setShowPassword(!showPassword)

    return (
        <div className="relative">
            <Input
                value={value}
                name='password'
                onChange={(e) => onChange(e.target.name, e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="pr-10" // space for the icon
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={togglePassword}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
        </div>
    )
}
