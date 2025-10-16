"use client"
import StatusChips from '@/components/reusableComponents/status-chips'
import { TableCell, TableRow } from '@/components/ui/table'
import React from 'react'
interface itemData {
    row: any,
    indexNumber:number
}
const ModuleRows = ({ row,indexNumber }: itemData) => {
    return (
        <TableRow>
            <TableCell align='center'>{indexNumber+1}</TableCell>
            <TableCell align='center' style={{textTransform:"capitalize"}}>{row?.name}</TableCell>
            <TableCell align='center'><StatusChips status={row?.is_active}/></TableCell>
        </TableRow>
    )
}

export default ModuleRows