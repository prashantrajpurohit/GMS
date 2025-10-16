'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

type CustomDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  size:number
}
export function DialogDemo({ open, onOpenChange, title, description, children }: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[525px]`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {!!description &&
            <DialogDescription>
              {description}
            </DialogDescription>
          }

        </DialogHeader>
        {children}
       

      </DialogContent>

    </Dialog>
  )
}
