"use client"

import React from 'react'
import { Badge } from '../ui/badge'

interface StatusChipProps {
    status: boolean
}
const StatusChips = ({ status }: StatusChipProps) => {
    return (
        <div>
            {status ?
                <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 shadow-none rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" /> Active
                </Badge> :
                <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 shadow-none rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" /> Inactive
                </Badge>

            }
        </div>
    )
}

export default StatusChips

{/* <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 shadow-none rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" /> In
                Progress
            </Badge> */}